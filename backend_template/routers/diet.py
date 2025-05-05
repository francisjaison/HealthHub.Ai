
"""
Diet management routes for HealthHub API
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime

from database import get_db
import models
import schemas
from routers.auth import get_current_user

router = APIRouter(
    prefix="/diet",
    tags=["diet"],
)

@router.post("/plans", response_model=schemas.DietPlanResponse)
async def create_diet_plan(
    plan: schemas.DietPlanCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new diet plan for the user"""
    db_plan = models.DietPlan(
        user_id=current_user.id,
        plan_name=plan.plan_name,
        daily_calories=plan.daily_calories,
        protein_grams=plan.protein_grams,
        carbs_grams=plan.carbs_grams,
        fat_grams=plan.fat_grams,
        start_date=plan.start_date,
        end_date=plan.end_date
    )
    
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    
    return db_plan

@router.get("/plans", response_model=List[schemas.DietPlanResponse])
async def get_diet_plans(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all diet plans for the user"""
    plans = db.query(models.DietPlan).filter(
        models.DietPlan.user_id == current_user.id
    ).all()
    
    return plans

@router.get("/plans/current", response_model=schemas.DietPlanResponse)
async def get_current_diet_plan(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the user's current active diet plan"""
    today = datetime.now().date()
    
    plan = db.query(models.DietPlan).filter(
        models.DietPlan.user_id == current_user.id,
        models.DietPlan.start_date <= today,
        (models.DietPlan.end_date >= today) | (models.DietPlan.end_date.is_(None))
    ).first()
    
    if plan is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active diet plan found"
        )
    
    return plan

@router.post("/plans/{plan_id}/meals", response_model=schemas.MealResponse)
async def add_meal_to_plan(
    plan_id: int,
    meal: schemas.MealCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a meal to an existing diet plan"""
    # Verify the plan belongs to the user
    plan = db.query(models.DietPlan).filter(
        models.DietPlan.id == plan_id,
        models.DietPlan.user_id == current_user.id
    ).first()
    
    if plan is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diet plan not found"
        )
    
    # Create the meal
    db_meal = models.Meal(
        diet_plan_id=plan_id,
        name=meal.name,
        calories=meal.calories,
        time_of_day=meal.time_of_day
    )
    
    db.add(db_meal)
    db.commit()
    db.refresh(db_meal)
    
    return db_meal

@router.get("/recipes", response_model=List[Dict[str, Any]])
async def get_recipes(
    current_user: models.User = Depends(get_current_user),
    diet_type: str = None,
    meal_type: str = None,
    max_calories: int = None
):
    """
    Get recipe recommendations based on user preferences.
    This is a placeholder that would connect to a recipe API or database.
    """
    # Mock recipes - in a real app, this would come from a database or external API
    recipes = [
        {
            "id": 1,
            "title": "Mediterranean Bowl",
            "time": "25 mins",
            "difficulty": "Easy",
            "calories": 450,
            "protein": 22,
            "carbs": 55,
            "fat": 15,
            "ingredients": ["quinoa", "chickpeas", "cucumber", "tomato", "feta cheese", "olive oil"],
            "steps": ["Cook quinoa", "Combine all ingredients", "Drizzle with olive oil"]
        },
        {
            "id": 2,
            "title": "Grilled Chicken Salad",
            "time": "20 mins",
            "difficulty": "Easy",
            "calories": 380,
            "protein": 35,
            "carbs": 15,
            "fat": 18,
            "ingredients": ["chicken breast", "mixed greens", "cherry tomatoes", "cucumber", "balsamic vinegar"],
            "steps": ["Grill chicken", "Chop vegetables", "Combine and dress with balsamic"]
        },
        {
            "id": 3,
            "title": "Quinoa Veggie Stir-fry",
            "time": "30 mins",
            "difficulty": "Medium",
            "calories": 420,
            "protein": 15,
            "carbs": 65,
            "fat": 12,
            "ingredients": ["quinoa", "bell peppers", "broccoli", "carrots", "soy sauce", "garlic"],
            "steps": ["Cook quinoa", "Stir-fry vegetables", "Combine and season"]
        }
    ]
    
    # Filter based on parameters (if provided)
    filtered_recipes = recipes
    
    if max_calories:
        filtered_recipes = [r for r in filtered_recipes if r["calories"] <= max_calories]
    
    return filtered_recipes
