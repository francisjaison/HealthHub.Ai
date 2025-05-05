
"""
Appointment management routes for HealthHub API
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from database import get_db
import models
import schemas
from routers.auth import get_current_user

router = APIRouter(
    prefix="/appointments",
    tags=["appointments"],
)

@router.post("/", response_model=schemas.AppointmentResponse)
async def create_appointment(
    appointment: schemas.AppointmentCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify the doctor exists
    doctor = db.query(models.User).filter(
        models.User.id == appointment.doctor_id,
        models.User.role == "doctor"
    ).first()
    
    if doctor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    # Create the appointment
    db_appointment = models.Appointment(
        patient_id=current_user.id,
        doctor_id=appointment.doctor_id,
        appointment_time=appointment.appointment_time,
        status="scheduled",
        appointment_type=appointment.appointment_type,
        notes=appointment.notes
    )
    
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    
    return db_appointment

@router.get("/", response_model=List[schemas.AppointmentResponse])
async def get_appointments(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    status: str = None
):
    query = None
    
    if current_user.role == "patient":
        # Patients see only their appointments
        query = db.query(models.Appointment).filter(models.Appointment.patient_id == current_user.id)
    elif current_user.role == "doctor":
        # Doctors see appointments where they are the doctor
        query = db.query(models.Appointment).filter(models.Appointment.doctor_id == current_user.id)
    elif current_user.role == "admin":
        # Admins see all appointments
        query = db.query(models.Appointment)
    
    if status:
        query = query.filter(models.Appointment.status == status)
    
    appointments = query.offset(skip).limit(limit).all()
    return appointments

@router.get("/{appointment_id}", response_model=schemas.AppointmentResponse)
async def get_appointment(
    appointment_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = None
    
    if current_user.role == "patient":
        # Patients see only their appointments
        query = db.query(models.Appointment).filter(
            models.Appointment.id == appointment_id,
            models.Appointment.patient_id == current_user.id
        )
    elif current_user.role == "doctor":
        # Doctors see appointments where they are the doctor
        query = db.query(models.Appointment).filter(
            models.Appointment.id == appointment_id,
            models.Appointment.doctor_id == current_user.id
        )
    elif current_user.role == "admin":
        # Admins see all appointments
        query = db.query(models.Appointment).filter(models.Appointment.id == appointment_id)
    
    appointment = query.first()
    
    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    return appointment

@router.put("/{appointment_id}", response_model=schemas.AppointmentResponse)
async def update_appointment(
    appointment_id: int,
    appointment_update: schemas.AppointmentUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Determine if user has access to this appointment
    appointment = None
    
    if current_user.role == "patient":
        appointment = db.query(models.Appointment).filter(
            models.Appointment.id == appointment_id,
            models.Appointment.patient_id == current_user.id
        ).first()
    elif current_user.role == "doctor":
        appointment = db.query(models.Appointment).filter(
            models.Appointment.id == appointment_id,
            models.Appointment.doctor_id == current_user.id
        ).first()
    elif current_user.role == "admin":
        appointment = db.query(models.Appointment).filter(
            models.Appointment.id == appointment_id
        ).first()
    
    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    # Update appointment fields
    for field, value in appointment_update.dict(exclude_unset=True).items():
        setattr(appointment, field, value)
    
    db.commit()
    db.refresh(appointment)
    
    return appointment

@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_appointment(
    appointment_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Find the appointment
    appointment = None
    
    if current_user.role == "patient":
        appointment = db.query(models.Appointment).filter(
            models.Appointment.id == appointment_id,
            models.Appointment.patient_id == current_user.id
        ).first()
    elif current_user.role in ["doctor", "admin"]:
        appointment = db.query(models.Appointment).filter(
            models.Appointment.id == appointment_id
        ).first()
    
    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    # Update status to cancelled instead of deleting
    appointment.status = "cancelled"
    db.commit()
    
    return None
