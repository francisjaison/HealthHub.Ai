"""
Pydantic schemas for request/response models
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from models import UserRole, DocumentType

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[UserRole] = None

class UserBase(BaseModel):
    email: EmailStr
    name: str
    
class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role: UserRole
    profile_completed: bool
    created_at: datetime
    
    class Config:
        orm_mode = True

# Health record schemas
class HealthRecordBase(BaseModel):
    record_type: str
    value: float
    unit: str
    notes: Optional[str] = None

class HealthRecordCreate(HealthRecordBase):
    pass

class HealthRecordUpdate(BaseModel):
    value: Optional[float] = None
    notes: Optional[str] = None

class HealthRecordResponse(HealthRecordBase):
    id: int
    user_id: int
    recorded_at: datetime
    
    class Config:
        orm_mode = True

# Document file schemas
class DocumentFileBase(BaseModel):
    file_name: str
    file_type: str
    file_size: int
    category: DocumentType
    notes: Optional[str] = None

class DocumentFileCreate(DocumentFileBase):
    file_path: str
    user_id: int

class DocumentFileUpdate(BaseModel):
    category: Optional[DocumentType] = None
    notes: Optional[str] = None

class DocumentFileResponse(DocumentFileBase):
    id: int
    user_id: int
    file_path: str
    uploaded_at: datetime
    
    class Config:
        orm_mode = True

# Appointment schemas
class AppointmentBase(BaseModel):
    doctor_id: int
    scheduled_for: datetime
    reason: Optional[str] = None
    notes: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class AppointmentResponse(AppointmentBase):
    id: int
    patient_id: int
    status: str
    
    class Config:
        orm_mode = True

# Diet plan schemas
class DietPlanBase(BaseModel):
    plan_name: str
    daily_calories: int
    protein_grams: int
    carbs_grams: int
    fat_grams: int
    start_date: datetime
    end_date: Optional[datetime] = None
    meals: Optional[Dict[str, Any]] = None

class DietPlanCreate(DietPlanBase):
    pass

class DietPlanResponse(DietPlanBase):
    id: int
    user_id: int
    
    class Config:
        orm_mode = True

# Disease risk schemas
class DiseaseRiskBase(BaseModel):
    disease_name: str
    risk_score: float
    factors: Dict[str, Any]

class DiseaseRiskResponse(DiseaseRiskBase):
    id: int
    user_id: int
    assessed_at: datetime
    
    class Config:
        orm_mode = True

class DiseaseRiskCreate(DiseaseRiskBase):
    pass

class RiskReportCreate(BaseModel):
    patient_id: int
    risk_level: str
    details: str

class RiskReportResponse(BaseModel):
    id: int
    patient_id: int
    date: datetime
    risk_level: str
    details: str
    
    class Config:
        from_attributes = True

# AI Chat Schemas
class AIChatMessageInput(BaseModel):
    message: str = Field(..., min_length=1, description="User message to the AI chat bot")

class AIChatMessageOutput(BaseModel):
    response: str = Field(..., description="AI chat bot response")

class PatientHistoryResponse(BaseModel):
    id: int
    patient_id: int
    risk_reports: List['RiskReportResponse']
    last_visit: datetime
    advice_history: List['DoctorAdviceResponse']
    
    class Config:
        from_attributes = True

class DoctorAdvice(BaseModel):
    advice: str

class DoctorAdviceResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    advice: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class AppointmentStatusUpdate(BaseModel):
    status: str

class SystemStatsResponse(BaseModel):
    total_users: int
    active_sessions: int
    total_doctors: int
    pending_approvals: int

class UserStatusUpdate(BaseModel):
    status: str
