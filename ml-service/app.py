from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from sklearn.ensemble import IsolationForest
import numpy as np
import os

app = Flask(__name__)
CORS(app)

MONGO_URI = "mongodb+srv://aparajit1sharma6404_db_user:3lRfqTSIFFOkzWkX@cluster0.l1tr6de.mongodb.net/pipelineiq"

@app.route("/api/anomalies")
def detect_anomalies():
    client = MongoClient(MONGO_URI)
    db = client["pipelineiq"]
    pipelines = list(db.pipelines.find())

    if len(pipelines) < 3:
        return jsonify([])

    names = [p["name"] for p in pipelines if not p["name"].startswith("Auto")]
    data = [[p["pressure"], p["flow"], p["temp"]] for p in pipelines if not p["name"].startswith("Auto")]

    if len(data) < 3:
        return jsonify([])

    X = np.array(data)
    model = IsolationForest(contamination=0.2, random_state=42)
    preds = model.fit_predict(X)
    scores = model.score_samples(X)

    results = []
    for i, p in enumerate([p for p in pipelines if not p["name"].startswith("Auto")]):
        anomaly_score = round((1 - (scores[i] - scores.min()) / (scores.max() - scores.min() + 1e-9)) * 100, 1)
        results.append({
            "name": names[i],
            "status": p["status"],
            "pressure": p["pressure"],
            "flow": p["flow"],
            "temp": p["temp"],
            "isAnomaly": bool(preds[i] == -1),
            "anomalyScore": anomaly_score,
        })

    results.sort(key=lambda x: x["anomalyScore"], reverse=True)
    return jsonify(results)

@app.route("/")
def health():
    return "ML Service Running"

if __name__ == "__main__":
    app.run(port=5001, debug=True)
