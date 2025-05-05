"""
Database models for the HealthHub application
"""
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, Table, Text, Enum as SQLEnum, LargeBinary
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSON # Import JSON type
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import enum

Base = declarative_base()

class UserRole(str, enum.Enum):
    admin = "admin"
    doctor = "doctor"
    patient = "patient"

# Enum for Health Record Types
class HealthRecordType(str, enum.Enum):
    blood_pressure = "blood_pressure"
    heart_rate = "heart_rate"
    weight = "weight"
    blood_glucose = "blood_glucose"
    # Add more specific types as needed

# Enum for Health Record Units (consider linking units to types)
class HealthRecordUnit(str, enum.Enum):
    mmHg = "mmHg"
    bpm = "bpm"
    kg = "kg"
    lbs = "lbs"
    mg_dL = "mg/dL"
    mmol_L = "mmol/L"
    # Add more units

# Enum for Appointment Status
class AppointmentStatus(str, enum.Enum):
    scheduled = "scheduled"
    completed = "completed"
    cancelled = "cancelled"
    pending = "pending" # Added pending status

# Enum for Appointment Type
class AppointmentType(str, enum.Enum):
    consultation = "consultation"
    follow_up = "follow-up"
    examination = "examination"
    teleconsultation = "teleconsultation" # Added teleconsultation

# Enum for Meal Time
class MealTime(str, enum.Enum):
    breakfast = "breakfast"
    lunch = "lunch"
    dinner = "dinner"
    snack = "snack"

# Document types for file uploads
class DocumentType(str, enum.Enum):
    medical_record = "Medical Record"
    lab_result = "Lab Result"
    prescription = "Prescription"
    vaccination = "Vaccination Record"
    discharge_summary = "Discharge Summary"
    referral_letter = "Referral Letter"
    medical_certificate = "Medical Certificate"
    other = "Other Document"

# Doctor-Patient relationship
doctor_patients = Table(
    "doctor_patients",
    Base.metadata,
    Column("doctor_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("patient_id", Integer, ForeignKey("users.id"), primary_key=True)
)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole, name="user_role_enum"), default=UserRole.patient, nullable=False)
    profile_completed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    health_records = relationship("HealthRecord", back_populates="user")
    documents = relationship("DocumentFile", back_populates="user")
    appointments = relationship("Appointment", back_populates="patient", foreign_keys="Appointment.patient_id")
    doctor_appointments = relationship("Appointment", back_populates="doctor", foreign_keys="Appointment.doctor_id")
    diet_plans = relationship("DietPlan", back_populates="user")
    disease_risks = relationship("DiseaseRisk", back_populates="user")
    
    # For doctor role only
    patients = relationship(
        "User",
        secondary=doctor_patients,
        primaryjoin=id==doctor_patients.c.doctor_id,
        secondaryjoin=id==doctor_patients.c.patient_id,
        backref="doctors"
    )

class HealthRecord(Base):
    __tablename__ = "health_records"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    record_type = Column(SQLEnum(HealthRecordType, name="health_record_type_enum"), nullable=False, index=True)
    value = Column(Float, nullable=False)
    unit = Column(SQLEnum(HealthRecordUnit, name="health_record_unit_enum"), nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    notes = Column(Text, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="health_records")

class DocumentFile(Base):
    __tablename__ = "document_files"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=True)  # Path can be null if storing data directly
    file_type = Column(String, nullable=False) # MIME type
    file_size = Column(Integer, nullable=False) # Size in bytes
    file_data = Column(LargeBinary, nullable=True)  # Binary data for storing files directly in DB
    category = Column(SQLEnum(DocumentType, name="document_type_enum"), nullable=False, index=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    notes = Column(Text, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="documents")

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    appointment_time = Column(DateTime, nullable=False, index=True)
    status = Column(SQLEnum(AppointmentStatus, name="appointment_status_enum"), nullable=False, default=AppointmentStatus.scheduled)
    appointment_type = Column(SQLEnum(AppointmentType, name="appointment_type_enum"), nullable=False)
    notes = Column(Text, nullable=True)
    
    # Relationships
    patient = relationship("User", back_populates="appointments", foreign_keys=[patient_id])
    doctor = relationship("User", back_populates="doctor_appointments", foreign_keys=[doctor_id])

class DietPlan(Base):
    __tablename__ = "diet_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    plan_name = Column(String, nullable=False)
    daily_calories = Column(Integer, nullable=False)
    protein_grams = Column(Integer, nullable=False)
    carbs_grams = Column(Integer, nullable=False)
    fat_grams = Column(Integer, nullable=False)
    start_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="diet_plans")
    meals = relationship("Meal", back_populates="diet_plan", cascade="all, delete-orphan")

class Meal(Base):
    __tablename__ = "meals"
    
    id = Column(Integer, primary_key=True, index=True)
    diet_plan_id = Column(Integer, ForeignKey("diet_plans.id"), nullable=False)
    name = Column(String, nullable=False)
    calories = Column(Integer, nullable=False)
    time_of_day = Column(SQLEnum(MealTime, name="meal_time_enum"), nullable=False)
    
    # Relationships
    diet_plan = relationship("DietPlan", back_populates="meals")

class DiseaseRisk(Base):
    __tablename__ = "disease_risks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    disease_name = Column(String, nullable=False, index=True)
    risk_score = Column(Float, nullable=False)  # 0-100
    factors = Column(JSON, nullable=False)
    assessed_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="disease_risks")
