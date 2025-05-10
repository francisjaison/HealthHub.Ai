from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, date

from ..database import get_db
from ..models import User, Appointment, PatientHistory, RiskReport
from ..schemas import (
    AppointmentResponse,
    PatientHistoryResponse,
    RiskReportResponse,
    AppointmentStatusUpdate,
    DoctorAdvice
)
from .auth import get_current_user

router = APIRouter(
    prefix="/api/doctor",
    tags=["doctor"]
)

@router.get("/appointments", response_model=List[AppointmentResponse])
async def get_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all appointments for the current doctor"""
    if current_user.role != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only doctors can access appointments"
        )
    
    appointments = db.query(Appointment).filter(
        Appointment.doctor_id == current_user.id
    ).all()
    
    return appointments

@router.get("/patients/{patient_id}/history", response_model=PatientHistoryResponse)
async def get_patient_history(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get patient's medical history and risk reports"""
    if current_user.role != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only doctors can access patient history"
        )
    
    # Verify doctor has access to this patient
    appointment = db.query(Appointment).filter(
        Appointment.doctor_id == current_user.id,
        Appointment.patient_id == patient_id
    ).first()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found or not accessible"
        )
    
    patient_history = db.query(PatientHistory).filter(
        PatientHistory.patient_id == patient_id
    ).first()
    
    if not patient_history:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient history not found"
        )
    
    return patient_history

@router.post("/patients/{patient_id}/advice")
async def send_advice(
    patient_id: int,
    advice: DoctorAdvice,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send medical advice to a patient"""
    if current_user.role != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only doctors can send advice"
        )
    
    # Verify doctor has access to this patient
    appointment = db.query(Appointment).filter(
        Appointment.doctor_id == current_user.id,
        Appointment.patient_id == patient_id
    ).first()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found or not accessible"
        )
    
    # Create advice record
    advice_record = PatientHistory(
        patient_id=patient_id,
        doctor_id=current_user.id,
        advice=advice.advice,
        created_at=datetime.utcnow()
    )
    
    db.add(advice_record)
    db.commit()
    
    return {"message": "Advice sent successfully"}

@router.patch("/appointments/{appointment_id}")
async def update_appointment_status(
    appointment_id: int,
    status_update: AppointmentStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update appointment status"""
    if current_user.role != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only doctors can update appointments"
        )
    
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.doctor_id == current_user.id
    ).first()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    appointment.status = status_update.status
    db.commit()
    
    return {"message": "Appointment status updated successfully"}

@router.get("/availability/{date}")
async def get_available_slots(
    date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get available time slots for a specific date"""
    if current_user.role != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only doctors can check availability"
        )
    
    # Get all appointments for the given date
    appointments = db.query(Appointment).filter(
        Appointment.doctor_id == current_user.id,
        Appointment.date == date
    ).all()
    
    # Get doctor's working hours (you might want to store this in the database)
    working_hours = {
        "start": "09:00",
        "end": "17:00",
        "interval": 30  # minutes
    }
    
    # Calculate available slots
    booked_slots = {appointment.time for appointment in appointments}
    available_slots = []
    
    current_time = datetime.strptime(working_hours["start"], "%H:%M")
    end_time = datetime.strptime(working_hours["end"], "%H:%M")
    
    while current_time < end_time:
        time_str = current_time.strftime("%H:%M")
        if time_str not in booked_slots:
            available_slots.append(time_str)
        current_time = current_time.replace(
            minute=current_time.minute + working_hours["interval"]
        )
    
    return {"available_slots": available_slots} 