import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load env vars
load_dotenv()

# Initialize logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("backend_app")

# Initialize Flask app to serve React static frontend
app = Flask(__name__, static_folder="static", static_url_path="")
# Enable CORS for React frontend (localhost:5173) and production deploys
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Import services after loading env vars
from services.ai_service import AIService
from services.db_service import DBService
from services.mock_data import COLLECTION_CENTERS

# Instantiate services
ai_service = AIService()
db_service = DBService()

@app.route("/", methods=["GET"])
def home_index():
    """Serve the React frontend application."""
    return app.send_static_file("index.html")

@app.route("/api/health", methods=["GET"])
def health_check():
    """Service health status endpoint."""
    return jsonify({
        "status": "healthy",
        "timestamp": logging.Formatter().formatTime(logging.LogRecord("", 0, "", 0, "", (), None)),
        "mode": {
            "ai": "Groq Llama-3.3" if ai_service.client else "Local Heuristic Fallback",
            "database": "Firebase Firestore" if db_service.use_firebase else "Local JSON Store"
        }
    }), 200

@app.route("/api/classify", methods=["POST"])
def classify_item():
    """
    POST /api/classify
    Request body: { "item": "waste name" }
    """
    data = request.get_json() or {}
    item_name = data.get("item")
    
    if not item_name or not isinstance(item_name, str) or not item_name.strip():
        logger.warning("Classify endpoint received empty or invalid item name.")
        return jsonify({"error": "A non-empty 'item' string field is required."}), 400
        
    try:
        # 1. Classify waste item using AI or local database
        classification = ai_service.classify_waste(item_name)
        
        # 2. Save classification record to the database
        saved_record = db_service.save_scan(classification)
        
        return jsonify(saved_record), 200
    except Exception as e:
        logger.error(f"Error classifying item '{item_name}': {e}", exc_info=True)
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route("/api/history", methods=["GET"])
def get_history():
    """
    GET /api/history
    Retrieves the list of scanned waste items.
    """
    try:
        history = db_service.get_history()
        return jsonify(history), 200
    except Exception as e:
        logger.error(f"Error fetching history: {e}", exc_info=True)
        return jsonify({"error": f"Failed to retrieve history: {str(e)}"}), 500

@app.route("/api/history", methods=["POST"])
def add_history():
    """
    POST /api/history
    Manually save a scan record. Useful if frontend has some pre-classified offline logs.
    """
    data = request.get_json() or {}
    required_fields = ["wasteType", "category", "hazardLevel", "recyclable"]
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Missing required fields: {', '.join(required_fields)}"}), 400
        
    try:
        saved_record = db_service.save_scan(data)
        return jsonify(saved_record), 201
    except Exception as e:
        logger.error(f"Error manually adding to history: {e}", exc_info=True)
        return jsonify({"error": f"Failed to save record: {str(e)}"}), 500

@app.route("/api/history/<string:scan_id>", methods=["DELETE"])
def delete_history_item(scan_id):
    """
    DELETE /api/history/:id
    Deletes a specific scan record from database.
    """
    try:
        success = db_service.delete_scan(scan_id)
        if success:
            return jsonify({"success": True, "message": f"Scan {scan_id} deleted successfully."}), 200
        else:
            return jsonify({"error": "Scan item not found."}), 404
    except Exception as e:
        logger.error(f"Error deleting history item {scan_id}: {e}", exc_info=True)
        return jsonify({"error": f"Failed to delete scan: {str(e)}"}), 500

@app.route("/api/statistics", methods=["GET"])
def get_statistics():
    """
    GET /api/statistics
    Computes and returns dashboard statistics.
    """
    try:
        stats = db_service.get_statistics()
        return jsonify(stats), 200
    except Exception as e:
        logger.error(f"Error retrieving statistics: {e}", exc_info=True)
        return jsonify({"error": f"Failed to fetch statistics: {str(e)}"}), 500

@app.route("/api/centers", methods=["GET"])
def get_centers():
    """
    GET /api/centers
    Returns the list of nearby waste collection centers.
    Allows optional query filter '?type=Recycling centers'
    """
    center_type = request.args.get("type")
    try:
        if center_type:
            filtered = [c for c in COLLECTION_CENTERS if c["type"].lower() == center_type.lower()]
            return jsonify(filtered), 200
        return jsonify(COLLECTION_CENTERS), 200
    except Exception as e:
        logger.error(f"Error fetching centers: {e}", exc_info=True)
        return jsonify({"error": f"Failed to fetch collection centers: {str(e)}"}), 500

@app.route("/api/settings/reset", methods=["POST"])
def reset_data():
    """
    POST /api/settings/reset
    Clears database collection records. (Convenient for demoing the app).
    """
    try:
        success = db_service.clear_all_data()
        if success:
            return jsonify({"success": True, "message": "Database successfully reset."}), 200
        return jsonify({"error": "Failed to clear database."}), 500
    except Exception as e:
        logger.error(f"Error resetting database: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    # Run server locally
    logger.info(f"Starting Flask backend server on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)
