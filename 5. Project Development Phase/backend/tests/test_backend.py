import os
import sys
import unittest
import json

# Ensure backend root is in search path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set test environment flags
os.environ["USE_FIREBASE"] = "false"
os.environ["GROQ_API_KEY"] = ""

from app import app
from services.db_service import DBService

class WasteAssistantTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        
        # Override DB service local database path for testing to avoid polluting actual user files
        self.db_service = DBService()
        self.db_service.local_db_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)), "local_test_db.json"
        )
        # Clear test db
        self.db_service.clear_all_data()
        
        # Inject the modified DB service into the route endpoints
        import app as backend_module
        backend_module.db_service = self.db_service

    def tearDown(self):
        # Remove test database
        if os.path.exists(self.db_service.local_db_path):
            try:
                os.remove(self.db_service.local_db_path)
            except Exception:
                pass

    def test_health_check(self):
        """Tests health endpoint status."""
        response = self.app.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["status"], "healthy")
        self.assertIn("mode", data)

    def test_classify_validation(self):
        """Tests that classify endpoint rejects empty body and invalid payloads."""
        response = self.app.post("/api/classify", json={})
        self.assertEqual(response.status_code, 400)
        
        response = self.app.post("/api/classify", json={"item": "  "})
        self.assertEqual(response.status_code, 400)

    def test_classify_fallback_logic(self):
        """Tests that classification successfully uses fallback lists or defaults."""
        response = self.app.post("/api/classify", json={"item": "plastic bottle"})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["wasteType"], "Plastic Bottle")
        self.assertEqual(data["category"], "Plastic")
        self.assertTrue(data["recyclable"])
        self.assertGreater(len(data["disposalSteps"]), 0)

    def test_get_history(self):
        """Tests history fetching and deletion flows."""
        # 1. Start empty
        response = self.app.get("/api/history")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.data)), 0)

        # 2. Add manual scan record
        item = {
            "wasteType": "Test Glass Jar",
            "category": "Glass",
            "hazardLevel": "Low",
            "recyclable": True,
            "disposalSteps": ["Rinse", "Recycle"],
            "recyclingInstructions": ["Melt"],
            "ecoSuggestions": ["Reuse jar"]
        }
        response = self.app.post("/api/history", json=item)
        self.assertEqual(response.status_code, 201)
        record = json.loads(response.data)
        self.assertIn("id", record)
        self.assertEqual(record["wasteType"], "Test Glass Jar")

        # 3. Verify it is now in list
        response = self.app.get("/api/history")
        history = json.loads(response.data)
        self.assertEqual(len(history), 1)
        self.assertEqual(history[0]["id"], record["id"])

        # 4. Delete the item
        response = self.app.delete(f"/api/history/{record['id']}")
        self.assertEqual(response.status_code, 200)

        # 5. Verify it is empty again
        response = self.app.get("/api/history")
        self.assertEqual(len(json.loads(response.data)), 0)

    def test_get_statistics(self):
        """Tests stats calculations."""
        # Add a couple of dummy items
        self.app.post("/api/history", json={
            "wasteType": "Bottle", "category": "Plastic", "hazardLevel": "Low", "recyclable": True
        })
        self.app.post("/api/history", json={
            "wasteType": "Battery", "category": "Hazardous", "hazardLevel": "High", "recyclable": False
        })
        
        response = self.app.get("/api/statistics")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["totalScans"], 2)
        self.assertEqual(data["recyclableItems"], 1)
        self.assertEqual(data["hazardousItems"], 1)
        self.assertEqual(data["recyclingPercentage"], 50.0)

    def test_get_centers(self):
        """Tests collection center listings and filtering."""
        response = self.app.get("/api/centers")
        self.assertEqual(response.status_code, 200)
        centers = json.loads(response.data)
        self.assertGreater(len(centers), 0)
        
        # Test filters
        response = self.app.get("/api/centers?type=E-waste centers")
        self.assertEqual(response.status_code, 200)
        filtered = json.loads(response.data)
        for c in filtered:
            self.assertEqual(c["type"], "E-waste centers")

if __name__ == "__main__":
    unittest.main()
