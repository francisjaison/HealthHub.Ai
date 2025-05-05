"""
Risk assessment routes for HealthHub API
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime
from pydantic import BaseModel

from database import get_db
import models
import schemas
from routers.auth import get_current_user

router = APIRouter(
    prefix="/risk-assessment",
    tags=["risk assessment"],
)

class RiskFactorData(BaseModel):
    age: int
    sex: str
    bmi: float
    blood_pressure_systolic: int
    blood_pressure_diastolic: int
    cholesterol: float
    hdl: float
    ldl: float
    triglycerides: float
    glucose: float
    smoking: bool
    alcohol_consumption: str
    physical_activity: str
    family_history: Dict[str, Any]
    
class RiskAssessmentResponse(BaseModel):
    disease: str
    risk_score: float
    risk_level: str
    contributing_factors: List[Dict[str, Any]]
    recommendations: List[str]

@router.post("/analyze", response_model=List[RiskAssessmentResponse])
async def analyze_health_risks(
    risk_data: RiskFactorData,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyze health risks based on provided risk factors.
    This would use medical risk prediction models in a real implementation.
    """
    # This is a placeholder implementation
    # In a real app, this would use validated medical risk models
    
    # Calculate mock risk scores
    heart_disease_score = 0
    diabetes_score = 0
    stroke_score = 0
    
    # Age risk factor
    if risk_data.age > 50:
        heart_disease_score += 10
        stroke_score += 15
        diabetes_score += 5
    
    # Blood pressure risk factor
    if risk_data.blood_pressure_systolic > 140 or risk_data.blood_pressure_diastolic > 90:
        heart_disease_score += 15
        stroke_score += 20
        diabetes_score += 5
    
    # Cholesterol risk factor
    if risk_data.cholesterol > 200:
        heart_disease_score += 10
        stroke_score += 5
    
    # BMI risk factor
    if risk_data.bmi > 30:
        heart_disease_score += 10
        stroke_score += 10
        diabetes_score += 15
    
    # Glucose risk factor
    if risk_data.glucose > 100:
        diabetes_score += 20
        heart_disease_score += 5
    
    # Smoking risk factor
    if risk_data.smoking:
        heart_disease_score += 15
        stroke_score += 15
        diabetes_score += 5
    
    # Family history (simplified)
    if risk_data.family_history.get("heart_disease"):
        heart_disease_score += 15
    if risk_data.family_history.get("diabetes"):
        diabetes_score += 15
    if risk_data.family_history.get("stroke"):
        stroke_score += 15
    
    # Create response objects
    risk_assessments = [
        RiskAssessmentResponse(
            disease="Heart Disease",
            risk_score=min(heart_disease_score, 100),
            risk_level="High" if heart_disease_score > 50 else "Moderate" if heart_disease_score > 25 else "Low",
            contributing_factors=[
                {"factor": "Blood Pressure", "status": "Elevated", "impact": "High"} 
                if risk_data.blood_pressure_systolic > 140 else {"factor": "Blood Pressure", "status": "Normal", "impact": "Low"},
                {"factor": "Cholesterol", "status": "Elevated", "impact": "Medium"}
                if risk_data.cholesterol > 200 else {"factor": "Cholesterol", "status": "Normal", "impact": "Low"},
            ],
            recommendations=[
                "Maintain a heart-healthy diet low in saturated fats",
                "Aim for 150 minutes of moderate aerobic exercise weekly",
                "Monitor blood pressure regularly"
            ]
        ),
        RiskAssessmentResponse(
            disease="Type 2 Diabetes",
            risk_score=min(diabetes_score, 100),
            risk_level="High" if diabetes_score > 50 else "Moderate" if diabetes_score > 25 else "Low",
            contributing_factors=[
                {"factor": "Blood Glucose", "status": "Elevated", "impact": "High"} 
                if risk_data.glucose > 100 else {"factor": "Blood Glucose", "status": "Normal", "impact": "Low"},
                {"factor": "BMI", "status": "Elevated", "impact": "High"}
                if risk_data.bmi > 30 else {"factor": "BMI", "status": "Normal", "impact": "Low"},
            ],
            recommendations=[
                "Maintain a balanced diet low in refined carbohydrates",
                "Regular physical activity to improve insulin sensitivity",
                "Monitor blood glucose levels"
            ]
        ),
        RiskAssessmentResponse(
            disease="Stroke",
            risk_score=min(stroke_score, 100),
            risk_level="High" if stroke_score > 50 else "Moderate" if stroke_score > 25 else "Low",
            contributing_factors=[
                {"factor": "Blood Pressure", "status": "Elevated", "impact": "High"} 
                if risk_data.blood_pressure_systolic > 140 else {"factor": "Blood Pressure", "status": "Normal", "impact": "Low"},
                {"factor": "Smoking", "status": "Current smoker", "impact": "High"}
                if risk_data.smoking else {"factor": "Smoking", "status": "Non-smoker", "impact": "Low"},
            ],
            recommendations=[
                "Maintain blood pressure in normal range",
                "If you smoke, seek support to quit",
                "Regular physical activity and a balanced diet"
            ]
        )
    ]
    
    # In a real application, you would save these results to the database
    # for historical tracking and comparison
    
    return risk_assessments

@router.get("/history", response_model=List[Dict[str, Any]])
async def get_risk_assessment_history(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the user's risk assessment history"""
    risk_history = db.query(models.DiseaseRisk).filter(
        models.DiseaseRisk.user_id == current_user.id
    ).order_by(models.DiseaseRisk.assessed_at.desc()).all()
    
    # Format the response
    history = []
    for risk in risk_history:
        # The factors field is already in JSON format, no conversion needed
        history.append({
            "id": risk.id,
            "disease": risk.disease_name,
            "risk_score": risk.risk_score,
            "risk_level": "High" if risk.risk_score > 50 else "Moderate" if risk.risk_score > 25 else "Low",
            "factors": risk.factors,
            "assessed_at": risk.assessed_at
        })
    
    return history
