"""
Fitness tracking routes for HealthHub API
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime, timedelta
from pydantic import BaseModel

from database import get_db
import models
import schemas
from routers.auth import get_current_user

router = APIRouter(
    prefix="/fitness",
    tags=["fitness"],
)

class ExerciseLog(BaseModel):
    exercise_type: str
    duration_minutes: int
    calories_burned: int
    date: datetime

class WorkoutPlan(BaseModel):
    name: str
    description: str
    exercises: List[Dict[str, Any]]

@router.post("/exercise-logs", status_code=status.HTTP_201_CREATED)
async def log_exercise(
    exercise: ExerciseLog,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log a completed exercise session"""
    # In a real app, you would save this to a fitness_logs table
    # For this template, we'll create a health record entry instead
    
    db_record = models.HealthRecord(
        user_id=current_user.id,
        record_type="exercise",
        value=exercise.duration_minutes,
        unit="minutes",
        notes=f"Exercise: {exercise.exercise_type}, Calories: {exercise.calories_burned}"
    )
    
    db.add(db_record)
    db.commit()
    
    return {"message": "Exercise logged successfully"}

@router.get("/exercise-logs", response_model=List[Dict[str, Any]])
async def get_exercise_logs(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
    start_date: datetime = None,
    end_date: datetime = None
):
    """Get exercise logs for the current user within a date range"""
    query = db.query(models.HealthRecord).filter(
        models.HealthRecord.user_id == current_user.id,
        models.HealthRecord.record_type == "exercise"
    )
    
    if start_date:
        query = query.filter(models.HealthRecord.recorded_at >= start_date)
    if end_date:
        query = query.filter(models.HealthRecord.recorded_at <= end_date)
    
    records = query.order_by(models.HealthRecord.recorded_at.desc()).all()
    
    # Transform the records into exercise log format
    exercise_logs = []
    for record in records:
        exercise_type = "Unknown"
        calories = 0
        
        # Extract exercise type and calories from notes
        if record.notes:
            notes_parts = record.notes.split(", ")
            if len(notes_parts) >= 2:
                exercise_type = notes_parts[0].replace("Exercise: ", "")
                calories = int(notes_parts[1].replace("Calories: ", ""))
        
        exercise_logs.append({
            "id": record.id,
            "exercise_type": exercise_type,
            "duration_minutes": record.value,
            "calories_burned": calories,
            "date": record.recorded_at
        })
    
    return exercise_logs

@router.get("/workout-plans", response_model=List[WorkoutPlan])
async def get_workout_plans(
    current_user: models.User = Depends(get_current_user),
    fitness_level: str = "intermediate",
    goal: str = "general"
):
    """
    Get workout plan suggestions based on user preferences.
    This is a placeholder that would connect to a workout plans database.
    """
    # Mock workout plans - in a real app, this would come from a database
    workout_plans = [
        {
            "name": "Beginner Strength Training",
            "description": "A gentle introduction to strength training for beginners",
            "exercises": [
                {"name": "Bodyweight Squats", "sets": 3, "reps": 10, "rest": "60 seconds"},
                {"name": "Push-ups (or Modified Push-ups)", "sets": 3, "reps": 8, "rest": "60 seconds"},
                {"name": "Plank", "sets": 3, "duration": "30 seconds", "rest": "45 seconds"},
                {"name": "Dumbbell Rows", "sets": 3, "reps": 10, "rest": "60 seconds"}
            ]
        },
        {
            "name": "Cardio Fitness",
            "description": "Improve cardiovascular health and endurance",
            "exercises": [
                {"name": "Jumping Jacks", "sets": 3, "duration": "60 seconds", "rest": "30 seconds"},
                {"name": "High Knees", "sets": 3, "duration": "45 seconds", "rest": "30 seconds"},
                {"name": "Mountain Climbers", "sets": 3, "duration": "45 seconds", "rest": "30 seconds"},
                {"name": "Burpees", "sets": 3, "reps": 10, "rest": "60 seconds"}
            ]
        },
        {
            "name": "Flexibility & Mobility",
            "description": "Improve flexibility and joint mobility",
            "exercises": [
                {"name": "Cat-Cow Stretch", "duration": "60 seconds"},
                {"name": "Downward Dog", "duration": "45 seconds"},
                {"name": "Pigeon Pose", "sets": 2, "duration": "60 seconds per side"},
                {"name": "World's Greatest Stretch", "sets": 2, "reps": 5, "duration": "30 seconds per side"}
            ]
        }
    ]
    
    # In a real app, you would filter based on the provided parameters
    return workout_plans
