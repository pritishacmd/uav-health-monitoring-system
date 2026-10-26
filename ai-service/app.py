from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="UAV AI Prediction Service",
    version="1.0.0"
)


class PredictionInput(BaseModel):
    battery_percentage: float
    temperature: float
    vibration: float
    altitude: float
    speed: float


@app.get("/health")
def health_check():
    return {
        "status": "OK",
        "message": "UAV AI Prediction Service is running"
    }


@app.get("/")
def root():
    return {
        "service": "UAV AI Prediction Service",
        "phase": 4
    }


@app.post("/api/ai/predict")
def predict(data: PredictionInput):

    risk_score = 0

    if data.battery_percentage < 30:
        risk_score += 30

    if data.temperature > 80:
        risk_score += 25

    if data.vibration > 7:
        risk_score += 25

    if data.speed > 100:
        risk_score += 10

    if data.altitude > 500:
        risk_score += 10

    if risk_score >= 70:
        prediction = "HIGH RISK"
        recommended_action = "Immediate inspection and maintenance required"
    elif risk_score >= 40:
        prediction = "MEDIUM RISK"
        recommended_action = "Monitor UAV closely and schedule inspection"
    else:
        prediction = "LOW RISK"
        recommended_action = "Continue normal operation"

    confidence_score = 100 - risk_score

    return {
        "status": "OK",
        "prediction": prediction,
        "risk_score": risk_score,
        "confidence_score": confidence_score,
        "recommended_action": recommended_action
    }