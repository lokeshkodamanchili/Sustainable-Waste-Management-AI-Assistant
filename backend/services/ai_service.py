import os
import json
import logging
from services.mock_data import LOCAL_CLASSIFICATION_DATABASE, get_generic_classification

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.model = "llama-3.3-70b-versatile"
        self.client = None
        
        if self.api_key:
            try:
                # Dynamic import of groq dependencies
                from groq import Groq
                self.client = Groq(api_key=self.api_key)
                logger.info("Groq client initialized successfully.")
            except ImportError:
                logger.error("groq package is not installed. Force-switching to local fallback mode.")
                self.client = None
            except Exception as e:
                logger.error(f"Failed to initialize Groq client: {e}")
        else:
            logger.info("GROQ_API_KEY not found. Operating in local fallback simulation mode.")

    def classify_waste(self, item_name: str) -> dict:
        """
        Classifies waste item using Groq llama-3.3-70b-versatile or falls back to local database.
        """
        item_name = item_name.strip()
        if not item_name:
            raise ValueError("Item name cannot be empty")

        # If Groq is enabled and key exists, try AI generation
        if self.client:
            try:
                logger.info(f"Querying Groq API for item: {item_name}")
                response = self._query_groq_api(item_name)
                if response:
                    return response
            except Exception as e:
                logger.error(f"Error calling Groq API: {e}. Falling back to local rules.")
        
        # Local Fallback Classification Engine
        logger.info(f"Using local rule-based fallback for item: {item_name}")
        item_lower = item_name.lower()
        
        # Check exact and fuzzy match in our local database keys
        for key in LOCAL_CLASSIFICATION_DATABASE:
            if key in item_lower or item_lower in key:
                data = LOCAL_CLASSIFICATION_DATABASE[key].copy()
                # Personalize item name
                data["wasteType"] = item_name.title()
                return data
                
        # Generate programmatic classification if not in local list
        return get_generic_classification(item_name)

    def _query_groq_api(self, item_name: str) -> dict:
        """
        Helper method to run chat completions against Groq.
        """
        system_prompt = (
            "You are an expert waste classification and sustainability system.\n"
            "Your task is to identify and classify the given waste item into one of the following exact categories:\n"
            "['Plastic', 'Paper', 'Glass', 'Organic', 'Metal', 'Hazardous', 'E-waste', 'Medical waste'].\n\n"
            "Respond ONLY with a JSON object. Do not include any introductory or concluding text, markups, or markdown blocks.\n"
            "The JSON structure must match this schema exactly:\n"
            "{\n"
            '  "wasteType": "Official name of the item",\n'
            '  "category": "One of the 8 categories listed above",\n'
            '  "hazardLevel": "Low, Medium, High, or Critical",\n'
            '  "recyclable": true/false,\n'
            '  "disposalSteps": ["Step 1", "Step 2", ...],\n'
            '  "recyclingInstructions": ["Instruction 1", "Instruction 2", ...],\n'
            '  "ecoSuggestions": ["Suggestion 1", "Suggestion 2", ...]\n'
            "}\n\n"
            "Ensure guidelines are highly practical, specific, and environmentally sound."
        )

        user_prompt = f"Classify this item: {item_name}"

        completion = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.1,
            max_tokens=1024,
            response_format={"type": "json_object"}
        )

        raw_response = completion.choices[0].message.content
        logger.info(f"Groq API Response: {raw_response}")
        parsed_json = json.loads(raw_response)
        
        # Post-validation on fields
        valid_categories = ['Plastic', 'Paper', 'Glass', 'Organic', 'Metal', 'Hazardous', 'E-waste', 'Medical waste']
        if parsed_json.get("category") not in valid_categories:
            # Coerce to closet category
            parsed_json["category"] = "Organic"
            
        valid_hazards = ['Low', 'Medium', 'High', 'Critical']
        if parsed_json.get("hazardLevel") not in valid_hazards:
            parsed_json["hazardLevel"] = "Low"
            
        if not isinstance(parsed_json.get("recyclable"), bool):
            parsed_json["recyclable"] = False
            
        for list_field in ["disposalSteps", "recyclingInstructions", "ecoSuggestions"]:
            if not isinstance(parsed_json.get(list_field), list):
                parsed_json[list_field] = [str(parsed_json.get(list_field))] if parsed_json.get(list_field) else []
                
        return parsed_json
