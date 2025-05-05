"""
Disease prediction routes for HealthHub API
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from pydantic import BaseModel

from database import get_db
import models
import schemas
from routers.auth import get_current_user

router = APIRouter(
    prefix="/disease-predictor",
    tags=["disease predictor"],
)

class PredictionRequest(BaseModel):
    symptoms: List[str]
    medical_history: Dict[str, Any] = {}
    patient_data: Dict[str, Any] = {}

class PredictionResponse(BaseModel):
    disease_name: str
    probability: float
    risk_level: str
    recommendations: List[str]

@router.post("/predict", response_model=List[PredictionResponse])
async def predict_diseases(
    prediction_data: PredictionRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Predict possible diseases based on symptoms and patient data.
    This is a placeholder implementation that would be replaced with actual ML model predictions.
    """
    # In a real implementation, this would call a machine learning model
    # For now, we'll return mock predictions
    
    # This is just a placeholder, in real application you'd implement ML model inference
    mock_predictions = [
        PredictionResponse(
            disease_name="Common Cold",
            probability=0.85,
            risk_level="Low",
            recommendations=[
                "Rest and drink plenty of fluids",
                "Take over-the-counter cold medications",
                "Use a humidifier"
            ]
        ),
        PredictionResponse(
            disease_name="Seasonal Allergy",
            probability=0.65,
            risk_level="Low",
            recommendations=[
                "Avoid allergen exposure",
                "Consider antihistamines",
                "Use air purifiers indoors"
            ]
        )
    ]
    
    return mock_predictions

@router.post("/analyze/{disease_type}", response_model=schemas.DiseaseRiskResponse)
async def analyze_disease_risk(
    disease_type: str,
    health_data: Dict[str, Any],
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyze user's risk for a specific disease type based on their health data.
    Results are saved in the database for tracking over time.
    """
    # Placeholder for actual risk analysis algorithm
    # In a real app, you would use a proper risk assessment model
    
    if disease_type == "diabetes":
        risk_score = 35.5  # Example risk score
        factors = {"bmi": "high", "family_history": "positive", "diet": "moderate risk"}
    elif disease_type == "heart-disease":
        risk_score = 42.8
        factors = {"cholesterol": "elevated", "blood_pressure": "high", "exercise": "insufficient"}
    else:
        risk_score = 20.0
        factors = {"general": "low risk factors identified"}
    
    # Save risk assessment
    db_risk = models.DiseaseRisk(
        user_id=current_user.id,
        disease_name=disease_type,
        risk_score=risk_score,
        factors=factors  # Store directly as JSON
    )
    
    db.add(db_risk)
    db.commit()
    db.refresh(db_risk)
    
    return db_risk
