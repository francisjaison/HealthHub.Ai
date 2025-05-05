from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timedelta

from ..database import get_db
from ..models import User, Appointment, Session as DBSession
from ..schemas import (
    UserResponse,
    SystemStatsResponse,
    UserStatusUpdate
)
from ..auth import get_current_user

router = APIRouter(
    prefix="/api/admin",
    tags=["admin"]
)

@router.get("/stats", response_model=SystemStatsResponse)
async def get_system_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get system statistics"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can access system statistics"
        )
    
    # Get total users
    total_users = db.query(func.count(User.id)).scalar()
    
    # Get active sessions (sessions created in the last 30 minutes)
    active_sessions = db.query(func.count(DBSession.id)).filter(
        DBSession.created_at >= datetime.utcnow() - timedelta(minutes=30)
    ).scalar()
    
    # Get total doctors
    total_doctors = db.query(func.count(User.id)).filter(
        User.role == "doctor"
    ).scalar()
    
    # Get pending doctor approvals
    pending_approvals = db.query(func.count(User.id)).filter(
        User.role == "doctor",
        User.status == "pending"
    ).scalar()
    
    return {
        "total_users": total_users,
        "active_sessions": active_sessions,
        "total_doctors": total_doctors,
        "pending_approvals": pending_approvals
    }

@router.get("/users", response_model=List[UserResponse])
async def get_users(
    role: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all users with optional role filter"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can access user list"
        )
    
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    
    users = query.all()
    return users

@router.patch("/users/{user_id}/status")
async def update_user_status(
    user_id: int,
    status_update: UserStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update user status"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update user status"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.status = status_update.status
    db.commit()
    
    return {"message": "User status updated successfully"}

@router.post("/doctors/{user_id}/approve")
async def approve_doctor(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Approve a doctor's registration"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can approve doctors"
        )
    
    user = db.query(User).filter(
        User.id == user_id,
        User.role == "doctor"
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    user.status = "active"
    db.commit()
    
    return {"message": "Doctor approved successfully"}

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a user"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete users"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Don't allow deleting the last admin
    if user.role == "admin":
        admin_count = db.query(func.count(User.id)).filter(
            User.role == "admin",
            User.status == "active"
        ).scalar()
        if admin_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete the last admin user"
            )
    
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"} 