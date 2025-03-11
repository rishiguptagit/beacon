from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import pandas as pd
import numpy as np
import torch
from pytorch_model import EmergencyPredictionSystem
from typing import List, Dict, Any

app = FastAPI()

# Initialize PyTorch model
try:
    # Initialize with proper dimensions
    INPUT_DIM = 8  # Features: day_of_year, month, year, lat, long, temp, humidity, wind_speed
    OUTPUT_DIM = 5  # 4 emergency types + severity
    
    predictor = EmergencyPredictionSystem(
        input_dim=INPUT_DIM,
        hidden_dim=128,
        num_layers=2,
        output_dim=OUTPUT_DIM
    )
    
    # Load trained model if exists
    predictor.load_checkpoint('best_model.pth')
    print("Loaded trained model successfully")
except Exception as e:
    print(f"Could not load model: {e}")
    predictor = None

class PredictionRequest(BaseModel):
    location_lat: float
    location_long: float
    weather_temp: float
    weather_humidity: float
    weather_wind_speed: float

class TrainingData(BaseModel):
    data: List[Dict[str, Any]]  # List of historical emergency data with proper typing

@app.post("/predict")
async def predict_emergencies(request: PredictionRequest):
    if predictor is None:
        raise HTTPException(status_code=500, detail="Model not trained")
    
    # Prepare input features
    current_date = datetime.now()
    features = np.array([
        current_date.timetuple().tm_yday,  # day of year
        current_date.month,
        current_date.year,
        request.location_lat,
        request.location_long,
        request.weather_temp,
        request.weather_humidity,
        request.weather_wind_speed
    ]).reshape(1, 1, -1)  # Shape: [batch_size, sequence_length, features]
    
    try:
        # Get prediction from PyTorch model
        with torch.no_grad():
            prediction = predictor.predict(features)
            
        # Process predictions
        emergency_types = ['earthquake', 'flood', 'wildfire', 'storm']
        probs = prediction[0, :4]  # First 4 values are emergency type probabilities
        severity = prediction[0, 4]  # Last value is severity
        
        max_prob_idx = np.argmax(probs)
        
        # Generate reasoning
        reasoning = generate_reasoning(
            probs,
            severity,
            request.weather_temp,
            request.weather_humidity,
            request.weather_wind_speed
        )
        
        return {
            'predicted_emergency': emergency_types[max_prob_idx],
            'probability': prediction['emergency_type_probabilities'][max_prob_idx],
            'severity': prediction['severity'],
            'reasoning': reasoning,
            'recommendations': generate_recommendations(
                emergency_types[max_prob_idx],
                prediction['severity']
            )
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train")
async def train_model(data: TrainingData):
    try:
        global predictor
        
        # Convert training data to DataFrame
        df = pd.DataFrame(data.data)
        
        # Initialize model if not exists
        if predictor is None:
            predictor = EmergencyPredictionSystem(
                input_dim=8,  # number of features
                hidden_dim=128,
                num_layers=2,
                output_dim=5  # 4 emergency types + severity
            )
        
        # Prepare data loaders
        train_loader, val_loader = EmergencyPredictionSystem.prepare_data(df)
        
        # Train the model
        history = predictor.train(train_loader, val_loader)
        
        return {
            "message": "Model trained successfully",
            "history": {
                "train_loss": history['train_loss'],
                "val_loss": history['val_loss']
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def generate_reasoning(type_probs, severity, temp, humidity, wind_speed):
    """Generate human-readable reasoning for the prediction"""
    reasons = []
    
    # Weather-based reasoning
    if temp > 90:
        reasons.append("High temperatures increase risk of heat-related emergencies")
    if humidity > 80:
        reasons.append("High humidity could lead to severe weather conditions")
    if wind_speed > 30:
        reasons.append("Strong winds may escalate certain emergency situations")
    
    # Severity-based reasoning
    if severity > 0.7:
        reasons.append("Multiple risk factors indicate high severity potential")
    elif severity > 0.4:
        reasons.append("Moderate risk factors detected")
    
    return " and ".join(reasons) if reasons else "No immediate risk factors detected"

def generate_recommendations(emergency_type, severity):
    """Generate recommendations based on predicted emergency type and severity"""
    base_recommendations = {
        "earthquake": [
            "Secure heavy furniture and objects",
            "Know safe spots in each room",
            "Keep emergency supplies ready"
        ],
        "flood": [
            "Move valuables to higher ground",
            "Prepare emergency water supplies",
            "Monitor local weather updates"
        ],
        "wildfire": [
            "Clear vegetation around property",
            "Prepare evacuation plan",
            "Keep important documents accessible"
        ],
        "storm": [
            "Secure outdoor objects",
            "Check emergency kit supplies",
            "Stay informed about weather updates"
        ]
    }
    
    recommendations = base_recommendations.get(emergency_type, [])
    
    if severity > 0.7:
        recommendations.insert(0, "Consider immediate precautionary measures")
    
    return recommendations

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
