import os
import json
import logging
import uuid
from datetime import datetime, timedelta

# firebase-admin imports will be performed dynamically in __init__ if needed
firebase_admin = None
credentials = None
firestore = None

logger = logging.getLogger(__name__)

class DBService:
    def __init__(self):
        global firebase_admin, credentials, firestore
        self.use_firebase = os.getenv("USE_FIREBASE", "false").lower() == "true"
        self.db = None
        self.local_db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "local_db.json")
        
        if self.use_firebase:
            try:
                # Dynamic import of firebase dependencies
                import firebase_admin as fa
                from firebase_admin import credentials as creds, firestore as fs
                firebase_admin = fa
                credentials = creds
                firestore = fs

                # Avoid re-initialization if already initialized
                if not firebase_admin._apps:
                    cred_json = os.getenv("FIREBASE_CREDENTIALS_JSON")
                    cred_file = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
                    
                    if cred_json:
                        cred_dict = json.loads(cred_json)
                        cred = credentials.Certificate(cred_dict)
                    elif cred_file and os.path.exists(cred_file):
                        cred = credentials.Certificate(cred_file)
                    else:
                        logger.warning("Firebase requested but no credentials found. Trying Application Default Credentials...")
                        cred = credentials.ApplicationDefault()
                        
                    firebase_admin.initialize_app(cred)
                self.db = firestore.client()
                logger.info("Firebase Firestore initialized successfully.")
            except Exception as e:
                logger.error(f"Failed to initialize Firebase Firestore: {e}. Falling back to local database.")
                self.use_firebase = False

        if not self.use_firebase:
            logger.info("Using local JSON file database mode.")
            self._init_local_db()

    def _init_local_db(self):
        """Initializes local JSON database file if it does not exist."""
        if not os.path.exists(self.local_db_path):
            with open(self.local_db_path, "w") as f:
                json.dump({"scans": []}, f, indent=4)
            logger.info(f"Created local database file at: {self.local_db_path}")

    def _read_local_db(self) -> dict:
        """Reads local database."""
        self._init_local_db()
        try:
            with open(self.local_db_path, "r") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error reading local database: {e}")
            return {"scans": []}

    def _write_local_db(self, data: dict):
        """Writes to local database."""
        try:
            with open(self.local_db_path, "w") as f:
                json.dump(data, f, indent=4)
        except Exception as e:
            logger.error(f"Error writing to local database: {e}")

    def save_scan(self, scan_data: dict) -> dict:
        """
        Saves a scan record. Adds id and timestamp.
        """
        scan_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()
        
        record = {
            "id": scan_id,
            "timestamp": timestamp,
            "wasteType": scan_data.get("wasteType", "Unknown"),
            "category": scan_data.get("category", "Organic"),
            "hazardLevel": scan_data.get("hazardLevel", "Low"),
            "recyclable": bool(scan_data.get("recyclable", False)),
            "disposalSteps": scan_data.get("disposalSteps", []),
            "recyclingInstructions": scan_data.get("recyclingInstructions", []),
            "ecoSuggestions": scan_data.get("ecoSuggestions", [])
        }

        if self.use_firebase and self.db:
            try:
                self.db.collection("scans").document(scan_id).set(record)
                # Keep basic stats updated in analytics
                self._update_firebase_analytics(record)
                logger.info(f"Saved scan {scan_id} to Firebase.")
                return record
            except Exception as e:
                logger.error(f"Firebase save failed: {e}. Falling back to local save.")
        
        # Local JSON database save
        data = self._read_local_db()
        data["scans"].append(record)
        self._write_local_db(data)
        logger.info(f"Saved scan {scan_id} to local file db.")
        return record

    def _update_firebase_analytics(self, record: dict):
        """Helper to increment summary stats in Firebase."""
        try:
            date_str = record["timestamp"].split("T")[0]
            stats_ref = self.db.collection("analytics").document("summary")
            
            # Simple transactional update or merge
            stats_doc = stats_ref.get()
            if stats_doc.exists:
                stats = stats_doc.to_dict()
                stats["totalScans"] = stats.get("totalScans", 0) + 1
                if record["recyclable"]:
                    stats["recyclableCount"] = stats.get("recyclableCount", 0) + 1
                if record["hazardLevel"] in ["High", "Critical"]:
                    stats["hazardousCount"] = stats.get("hazardousCount", 0) + 1
                
                # Update daily scan chart info
                daily_scans = stats.get("dailyScans", {})
                daily_scans[date_str] = daily_scans.get(date_str, 0) + 1
                stats["dailyScans"] = daily_scans
                
                # Update category distributions
                cat_dist = stats.get("categoryDistribution", {})
                cat_dist[record["category"]] = cat_dist.get(record["category"], 0) + 1
                stats["categoryDistribution"] = cat_dist
                
                stats_ref.set(stats)
            else:
                stats_ref.set({
                    "totalScans": 1,
                    "recyclableCount": 1 if record["recyclable"] else 0,
                    "hazardousCount": 1 if record["hazardLevel"] in ["High", "Critical"] else 0,
                    "dailyScans": {date_str: 1},
                    "categoryDistribution": {record["category"]: 1}
                })
        except Exception as e:
            logger.error(f"Failed to update Firebase analytics summary: {e}")

    def get_history(self) -> list:
        """
        Retrieves history of scans sorted by timestamp descending.
        """
        if self.use_firebase and self.db:
            try:
                scans_ref = self.db.collection("scans").order_by("timestamp", direction=firestore.Query.DESCENDING).limit(100)
                docs = scans_ref.stream()
                scans = [doc.to_dict() for doc in docs]
                return scans
            except Exception as e:
                logger.error(f"Firebase get history failed: {e}. Falling back to local history.")

        # Local JSON database get history
        data = self._read_local_db()
        # Sort descending by timestamp
        scans = sorted(data["scans"], key=lambda x: x["timestamp"], reverse=True)
        return scans

    def delete_scan(self, scan_id: str) -> bool:
        """
        Deletes a scan record.
        """
        if self.use_firebase and self.db:
            try:
                self.db.collection("scans").document(scan_id).delete()
                # To be exact, analytics summary is not decremented to match local db behavior, which is fine
                logger.info(f"Deleted scan {scan_id} from Firebase.")
                return True
            except Exception as e:
                logger.error(f"Firebase delete scan failed: {e}. Falling back to local delete.")

        # Local JSON database delete
        data = self._read_local_db()
        initial_length = len(data["scans"])
        data["scans"] = [s for s in data["scans"] if s["id"] != scan_id]
        
        if len(data["scans"]) < initial_length:
            self._write_local_db(data)
            logger.info(f"Deleted scan {scan_id} from local file db.")
            return True
        logger.warning(f"Scan ID {scan_id} not found in local db.")
        return False

    def get_statistics(self) -> dict:
        """
        Returns stats dashboard data.
        """
        # If using firebase, we could read the summary document. However, doing a query read is safer
        # or we just build it dynamically if firebase lacks summary document. Let's make it robust
        scans = self.get_history()
        total_scans = len(scans)
        
        recyclable_count = sum(1 for s in scans if s.get("recyclable", False))
        hazardous_count = sum(1 for s in scans if s.get("hazardLevel") in ["High", "Critical"])
        
        recycling_rate = (recyclable_count / total_scans * 100) if total_scans > 0 else 0
        
        # Category distribution
        categories = ['Plastic', 'Paper', 'Glass', 'Organic', 'Metal', 'Hazardous', 'E-waste', 'Medical waste']
        category_distribution = {cat: 0 for cat in categories}
        for s in scans:
            cat = s.get("category", "Organic")
            if cat in category_distribution:
                category_distribution[cat] += 1
            else:
                category_distribution[cat] = category_distribution.get(cat, 0) + 1

        # Daily scan activity (for the last 7 days including today)
        daily_scans = {}
        today = datetime.utcnow().date()
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            daily_scans[day.isoformat()] = 0
            
        for s in scans:
            # ISO timestamp e.g. "2026-06-30T12:00:00"
            date_str = s.get("timestamp", "").split("T")[0]
            if date_str in daily_scans:
                daily_scans[date_str] += 1
                
        daily_activity = [{"date": k, "count": v} for k, v in sorted(daily_scans.items())]

        return {
            "totalScans": total_scans,
            "recyclableItems": recyclable_count,
            "hazardousItems": hazardous_count,
            "recyclingPercentage": round(recycling_rate, 2),
            "dailyScanActivity": daily_activity,
            "categoryDistribution": category_distribution,
            "databaseMode": "Firebase Firestore" if self.db and self.use_firebase else "Local JSON File Database"
        }

    def clear_all_data(self) -> bool:
        """Resets all data (useful for settings page demo configuration)."""
        if self.use_firebase and self.db:
            try:
                # Deleting collection documents in Firestore is done by deleting individually
                scans_ref = self.db.collection("scans").limit(500)
                docs = scans_ref.stream()
                for doc in docs:
                    doc.reference.delete()
                # Clear summary document
                self.db.collection("analytics").document("summary").delete()
                return True
            except Exception as e:
                logger.error(f"Failed to clear Firestore collection: {e}")
                return False
        else:
            self._write_local_db({"scans": []})
            return True
