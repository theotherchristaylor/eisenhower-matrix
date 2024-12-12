from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

DATA_FILE = os.path.join("data", "tasks.json")

# Ensure data folder and tasks.json exist
if not os.path.exists("data"):
    os.makedirs("data")
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump({"tasks": {}, "completed_tasks": []}, f)

@app.route("/load", methods=["GET"])
def load_tasks():
    try:
        with open(DATA_FILE, "r") as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        print("Error loading tasks:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/save", methods=["POST"])
def save_tasks():
    try:
        data = request.json
        print("Received data to save:", data)
        with open(DATA_FILE, "w") as f:
            json.dump(data, f)
        return jsonify({"message": "Tasks saved successfully!"})
    except Exception as e:
        print("Error saving tasks:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)

