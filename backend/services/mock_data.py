# Services mock data and fallback databases

COLLECTION_CENTERS = [
    {
        "id": "center-1",
        "name": "GreenLife Municipal Recycling Center",
        "type": "Recycling centers",
        "address": "742 Evergreen Terrace, Eco District",
        "phone": "(555) 123-4567",
        "hours": "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 4:00 PM",
        "acceptedTypes": ["Plastic", "Paper", "Glass", "Metal", "Cardboard"],
        "coordinates": [37.7749, -122.4194] # SF Center
    },
    {
        "id": "center-2",
        "name": "EcoVolt E-Waste Recovery Depot",
        "type": "E-waste centers",
        "address": "101 Silicon Valley Way, Tech Park",
        "phone": "(555) 987-6543",
        "hours": "Tue-Sat: 10:00 AM - 7:00 PM",
        "acceptedTypes": ["E-waste", "Metal", "Hazardous"],
        "coordinates": [37.7833, -122.4167]
    },
    {
        "id": "center-3",
        "name": "BioHumus Organic Composting Hub",
        "type": "Organic waste centers",
        "address": "404 Meadow Lane, Garden Suburb",
        "phone": "(555) 246-8135",
        "hours": "Daily: 7:00 AM - 5:00 PM",
        "acceptedTypes": ["Organic"],
        "coordinates": [37.7699, -122.4468]
    },
    {
        "id": "center-4",
        "name": "SafeHazard Chemical Disposal Point",
        "type": "Hazardous waste centers",
        "address": "500 Industrial Parkway, Sector 9",
        "phone": "(555) 369-1470",
        "hours": "Wed & Sat: 9:00 AM - 3:00 PM",
        "acceptedTypes": ["Hazardous", "Medical waste", "E-waste"],
        "coordinates": [37.7550, -122.4350]
    },
    {
        "id": "center-5",
        "name": "City Core Zero Waste Station",
        "type": "Recycling centers",
        "address": "12 Ocean Breeze Blvd, Downtown",
        "phone": "(555) 852-9630",
        "hours": "Mon-Sat: 8:00 AM - 8:00 PM",
        "acceptedTypes": ["Plastic", "Paper", "Glass", "Metal", "Organic"],
        "coordinates": [37.7891, -122.4014]
    }
]

# Rule-based fallback database for local offline classifications
LOCAL_CLASSIFICATION_DATABASE = {
    "plastic bottle": {
        "wasteType": "Plastic Bottle",
        "category": "Plastic",
        "hazardLevel": "Low",
        "recyclable": True,
        "disposalSteps": [
            "Empty any remaining liquid contents.",
            "Rinse the bottle with clean water.",
            "Crush/flatten the bottle to save space in the bin.",
            "Place in the plastic recycling bin with the cap screwed on."
        ],
        "recyclingInstructions": [
            "Accepted in standard curbside single-stream recycling.",
            "Ensure the plastic code is #1 (PETE) or #2 (HDPE) as they are universally recycled."
        ],
        "ecoSuggestions": [
            "Switch to a reusable stainless steel or glass water bottle.",
            "Avoid purchasing single-use plastic packaging whenever possible."
        ]
    },
    "paper bag": {
        "wasteType": "Paper Grocery Bag",
        "category": "Paper",
        "hazardLevel": "Low",
        "recyclable": True,
        "disposalSteps": [
            "Empty all items and receipts from the bag.",
            "Remove any plastic handles if attached.",
            "Flatten the bag and place in the paper recycling bin."
        ],
        "recyclingInstructions": [
            "Recycled into cardboard and new paper products.",
            "Keep dry; wet or heavily oil-stained paper (e.g. from food) should go in the compost instead."
        ],
        "ecoSuggestions": [
            "Use heavy-duty canvas bags for grocery shopping.",
            "Reuse paper bags as trash bin liners or for packing packages."
        ]
    },
    "cardboard box": {
        "wasteType": "Corrugated Cardboard Box",
        "category": "Paper",
        "hazardLevel": "Low",
        "recyclable": True,
        "disposalSteps": [
            "Remove all packing materials (Styrofoam, plastic wrap).",
            "Flatten the cardboard boxes completely.",
            "Place in the paper/cardboard recycling bin."
        ],
        "recyclingInstructions": [
            "Keep dry: wet cardboard degrades fibers and jams processing machines.",
            "Standard shipping tape is acceptable, but large plastic tape portions should be peeled off."
        ],
        "ecoSuggestions": [
            "Reuse boxes for storage or shipping.",
            "Consider buying items with minimal packaging."
        ]
    },
    "banana peel": {
        "wasteType": "Banana Peel",
        "category": "Organic",
        "hazardLevel": "Low",
        "recyclable": False,
        "disposalSteps": [
            "Remove any stickers or plastic labels from the peel.",
            "Place the peel in your green organic/compost bin.",
            "Alternatively, bury in your backyard garden soil to enrich it naturally."
        ],
        "recyclingInstructions": [
            "Not recyclable in standard bins.",
            "Decomposes aerobically in municipal composting facilities to create high-quality fertilizer."
        ],
        "ecoSuggestions": [
            "Start a home vermicomposting (worm farming) bin for fruit scraps.",
            "Create a compost pile to enrich your home garden soil."
        ]
    },
    "apple core": {
        "wasteType": "Apple Core",
        "category": "Organic",
        "hazardLevel": "Low",
        "recyclable": False,
        "disposalSteps": [
            "Discard any synthetic stickers.",
            "Place in the green compost/organic waste bin."
        ],
        "recyclingInstructions": [
            "Breaks down into nutrient-rich compost within 4-12 weeks in a proper facility."
        ],
        "ecoSuggestions": [
            "Create a compost bin in your garden.",
            "Eat the whole apple except the stem to reduce food waste!"
        ]
    },
    "glass jar": {
        "wasteType": "Glass Jar",
        "category": "Glass",
        "hazardLevel": "Low",
        "recyclable": True,
        "disposalSteps": [
            "Empty and rinse the jar to remove all food residues.",
            "Separate the metal lid (metals are recycled separately).",
            "Place the jar in the glass recycling bin."
        ],
        "recyclingInstructions": [
            "Glass is 100% recyclable infinitely without losing quality.",
            "Do not mix ceramics, mirrors, or window glass in the same bin, as they melt at different temperatures."
        ],
        "ecoSuggestions": [
            "Reuse glass jars to store dry goods, spices, or leftovers.",
            "Use as a drinking glass or propagation jar for plant clippings."
        ]
    },
    "aluminum can": {
        "wasteType": "Aluminum Beverage Can",
        "category": "Metal",
        "hazardLevel": "Low",
        "recyclable": True,
        "disposalSteps": [
            "Pour out any remaining liquid.",
            "Rinse lightly.",
            "Do not flatten completely (sorting facilities prefer 3D shapes to recognize them).",
            "Toss in the metal recycling bin."
        ],
        "recyclingInstructions": [
            "Highly recyclable. Recycling aluminum saves 95% of the energy needed to make new aluminum."
        ],
        "ecoSuggestions": [
            "Choose canned beverages over plastic bottles, as aluminum is recycled far more efficiently."
        ]
    },
    "aa battery": {
        "wasteType": "Alkaline AA Battery",
        "category": "Hazardous",
        "hazardLevel": "High",
        "recyclable": False,
        "disposalSteps": [
            "Do not throw in the trash or curbside recycling.",
            "Place a piece of clear tape over both contacts (+ and -) to prevent short circuits.",
            "Collect in a container and take to a hazardous waste or electronics retailer collection point."
        ],
        "recyclingInstructions": [
            "Processed at special facilities to extract zinc, manganese, and steel.",
            "Improper disposal leads to toxic chemicals leaching into ground soil."
        ],
        "ecoSuggestions": [
            "Switch to rechargeable NiMH batteries to cut battery waste by up to 99%."
        ]
    },
    "lithium battery": {
        "wasteType": "Lithium-ion Battery",
        "category": "Hazardous",
        "hazardLevel": "Critical",
        "recyclable": False,
        "disposalSteps": [
            "Never place in garbage or general recycling (they pose severe fire risks).",
            "Tape the battery terminals.",
            "Drop off at a designated e-waste or hazardous waste collection depot."
        ],
        "recyclingInstructions": [
            "Requires specialized thermal and chemical processing to safely reclaim valuable lithium, cobalt, and nickel."
        ],
        "ecoSuggestions": [
            "Look for devices with durable, long-lasting battery systems."
        ]
    },
    "laptop": {
        "wasteType": "Old Laptop",
        "category": "E-waste",
        "hazardLevel": "Medium",
        "recyclable": True,
        "disposalSteps": [
            "Back up all your personal data.",
            "Perform a factory reset/hard drive wipe to secure personal info.",
            "Take the laptop to a certified e-waste recycler or donation center."
        ],
        "recyclingInstructions": [
            "E-waste contains valuable gold, silver, and copper, as well as lead and mercury.",
            "Recycling reclaims precious metals while preventing environmental contamination."
        ],
        "ecoSuggestions": [
            "If the laptop still works, consider donating it to a school or local community charity.",
            "Repair or upgrade RAM/SSD rather than buying new hardware."
        ]
    },
    "syringe": {
        "wasteType": "Used Syringe / Needle",
        "category": "Medical waste",
        "hazardLevel": "Critical",
        "recyclable": False,
        "disposalSteps": [
            "Never discard directly into the trash or recycling bin.",
            "Place immediately in a designated sharps container or thick plastic bottle (like laundry detergent).",
            "Securely tape the cap when full and drop off at a hospital or hazardous waste station."
        ],
        "recyclingInstructions": [
            "Biohazardous waste. Must be autoclaved or incinerated at high temperatures to kill pathogens."
        ],
        "ecoSuggestions": [
            "Use safety needles and designated sharps disposal kits provided by pharmacies."
        ]
    }
}

# General fallback template for unknown items
def get_generic_classification(item_name: str) -> dict:
    item_lower = item_name.strip().lower()
    
    # Simple keyword matchers to pick category
    if any(k in item_lower for k in ["plastic", "bottle", "cup", "pvc", "polystyrene"]):
        category = "Plastic"
        recyclable = True
        hazard = "Low"
    elif any(k in item_lower for k in ["paper", "cardboard", "box", "magazine", "newspaper", "envelope"]):
        category = "Paper"
        recyclable = True
        hazard = "Low"
    elif any(k in item_lower for k in ["glass", "jar", "wine", "mirror"]):
        category = "Glass"
        recyclable = True
        hazard = "Low"
    elif any(k in item_lower for k in ["food", "banana", "apple", "veg", "fruit", "leaf", "bread", "organic", "scraps"]):
        category = "Organic"
        recyclable = False
        hazard = "Low"
    elif any(k in item_lower for k in ["metal", "can", "steel", "iron", "copper", "aluminum", "tin"]):
        category = "Metal"
        recyclable = True
        hazard = "Low"
    elif any(k in item_lower for k in ["battery", "chemical", "paint", "oil", "aerosol", "toxic"]):
        category = "Hazardous"
        recyclable = False
        hazard = "High"
    elif any(k in item_lower for k in ["computer", "phone", "tv", "cable", "electronics", "mouse", "keyboard"]):
        category = "E-waste"
        recyclable = True
        hazard = "Medium"
    elif any(k in item_lower for k in ["syringe", "medical", "pill", "drug", "sharp", "needle", "bandage"]):
        category = "Medical waste"
        recyclable = False
        hazard = "Critical"
    else:
        category = "Organic"
        recyclable = False
        hazard = "Low"

    return {
        "wasteType": item_name.title(),
        "category": category,
        "hazardLevel": hazard,
        "recyclable": recyclable,
        "disposalSteps": [
            f"Identify if the {item_name} has any local disposal labels.",
            f"Place in the appropriate {category.lower()} sorting bin if clean.",
            "When in doubt, contact local municipal guidelines."
        ],
        "recyclingInstructions": [
            f"Check if {category} is accepted in your local community guidelines.",
            "Ensure the item is dry and free of large food particles before sorting."
        ],
        "ecoSuggestions": [
            f"Try to reduce consumption of single-use {item_name} items.",
            "Look for biodegradable or reusable alternatives next time."
        ]
    }
