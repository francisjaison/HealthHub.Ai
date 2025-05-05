"""
Main FastAPI application entry point for HealthHub API
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List, Optional
import uvicorn

from routers import (
    auth,
    users,
    health_records,
    appointments,
    disease_predictor,
    diet,
    fitness,
    risk_assessment,
    ai_chat,
    doctor,
    admin
)

app = FastAPI(
    title="HealthHub API",
    description="Backend API for HealthHub health management platform",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",  # Alternative Vite URL
        "https://your-frontend-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(health_records.router)
app.include_router(appointments.router)
app.include_router(disease_predictor.router)
app.include_router(diet.router)
app.include_router(fitness.router)
app.include_router(risk_assessment.router)
app.include_router(ai_chat.router)
app.include_router(doctor.router)
app.include_router(admin.router)

@app.get("/")
async def root():
    return {"message": "Welcome to HealthHub API. See /docs for API documentation"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
