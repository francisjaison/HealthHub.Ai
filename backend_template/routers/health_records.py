"""
Health records management routes for HealthHub API
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Response
from sqlalchemy.orm import Session
from typing import List, Optional
import json
import os
import shutil
from datetime import datetime
from pathlib import Path

from database import get_db
import models
import schemas
from routers.auth import get_current_user

router = APIRouter(
    prefix="/health-records",
    tags=["health records"],
)

# Define the directory where uploaded files will be stored
UPLOAD_DIR = Path("uploads")
# Create directory if it doesn't exist
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/", response_model=schemas.HealthRecordResponse)
async def create_health_record(
    record: schemas.HealthRecordCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_record = models.HealthRecord(
        user_id=current_user.id,
        record_type=record.record_type,
        value=record.value,
        unit=record.unit,
        notes=record.notes
    )
    
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    return db_record

@router.get("/", response_model=List[schemas.HealthRecordResponse])
async def get_health_records(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    record_type: str = None
):
    query = db.query(models.HealthRecord).filter(models.HealthRecord.user_id == current_user.id)
    
    if record_type:
        query = query.filter(models.HealthRecord.record_type == record_type)
    
    records = query.offset(skip).limit(limit).all()
    return records

@router.get("/{record_id}", response_model=schemas.HealthRecordResponse)
async def get_health_record(
    record_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    record = db.query(models.HealthRecord).filter(
        models.HealthRecord.id == record_id,
        models.HealthRecord.user_id == current_user.id
    ).first()
    
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Health record not found"
        )
    
    return record

@router.put("/{record_id}", response_model=schemas.HealthRecordResponse)
async def update_health_record(
    record_id: int,
    record_update: schemas.HealthRecordUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_record = db.query(models.HealthRecord).filter(
        models.HealthRecord.id == record_id,
        models.HealthRecord.user_id == current_user.id
    ).first()
    
    if db_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Health record not found"
        )
    
    # Update record fields
    for field, value in record_update.dict(exclude_unset=True).items():
        setattr(db_record, field, value)
    
    db.commit()
    db.refresh(db_record)
    
    return db_record

@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_health_record(
    record_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_record = db.query(models.HealthRecord).filter(
        models.HealthRecord.id == record_id,
        models.HealthRecord.user_id == current_user.id
    ).first()
    
    if db_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Health record not found"
        )
    
    db.delete(db_record)
    db.commit()
    
    return None

# Document file endpoints
@router.post("/documents", response_model=schemas.DocumentFileResponse)
async def upload_document(
    file: UploadFile = File(...),
    metadata: str = Form(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload a document file related to health records.
    Metadata should be a JSON string containing:
    - fileName (original file name)
    - fileType (MIME type)
    - fileSize (file size in bytes)
    - category (document type/category)
    - notes (optional notes)
    """
    try:
        # Parse metadata
        metadata_dict = json.loads(metadata)
        
        # Validate file type
        allowed_types = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
                         "image/jpeg", "image/jpg", "image/png"]
        
        file_type = metadata_dict.get("fileType")
        if file_type not in allowed_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file type. Allowed types: {', '.join(allowed_types)}"
            )
            
        # Store file two ways - both in filesystem and in database
        # This allows for flexibility and fallback options
        
        # 1. Save to filesystem for traditional access
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{current_user.id}_{timestamp}{extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file to disk
        with open(file_path, "wb") as buffer:
            file_content = await file.read()
            buffer.write(file_content)
            
        # Reset file position for DB storage
        await file.seek(0)
        
        # 2. Read file content for database storage
        file_content_for_db = await file.read()
        
        # Create database record
        category_str = metadata_dict.get("category")
        # Convert string to enum
        try:
            category_enum = models.DocumentType(category_str)
        except ValueError:
            category_enum = models.DocumentType.other
            
        db_document = models.DocumentFile(
            user_id=current_user.id,
            file_name=metadata_dict.get("fileName"),
            file_path=str(file_path),  # Keep filepath as reference
            file_type=file_type,
            file_size=metadata_dict.get("fileSize"),
            file_data=file_content_for_db,  # Store binary data in DB
            category=category_enum,
            notes=metadata_dict.get("notes")
        )
        
        db.add(db_document)
        db.commit()
        db.refresh(db_document)
        
        return db_document
    
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid metadata format. JSON string expected."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading file: {str(e)}"
        )

@router.get("/documents", response_model=List[schemas.DocumentFileResponse])
async def get_documents(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 50,
    category: Optional[str] = None
):
    """Get all documents for the current user, optionally filtered by category"""
    query = db.query(models.DocumentFile).filter(models.DocumentFile.user_id == current_user.id)
    
    if category:
        try:
            category_enum = models.DocumentType(category)
            query = query.filter(models.DocumentFile.category == category_enum)
        except ValueError:
            # Invalid category, ignore filter
            pass
    
    documents = query.order_by(models.DocumentFile.uploaded_at.desc()).offset(skip).limit(limit).all()
    return documents

@router.get("/documents/{document_id}", response_model=schemas.DocumentFileResponse)
async def get_document(
    document_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific document by ID"""
    document = db.query(models.DocumentFile).filter(
        models.DocumentFile.id == document_id,
        models.DocumentFile.user_id == current_user.id
    ).first()
    
    if document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    return document

@router.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a document file"""
    document = db.query(models.DocumentFile).filter(
        models.DocumentFile.id == document_id,
        models.DocumentFile.user_id == current_user.id
    ).first()
    
    if document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Delete the physical file
    try:
        os.remove(document.file_path)
    except Exception:
        # Just log this, don't fail if file is missing
        print(f"Could not delete file at {document.file_path}")
    
    # Delete database record
    db.delete(document)
    db.commit()
    
    return None

@router.get("/documents/{document_id}/download")
async def download_document(
    document_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Download a document file by ID"""
    document = db.query(models.DocumentFile).filter(
        models.DocumentFile.id == document_id,
        models.DocumentFile.user_id == current_user.id
    ).first()
    
    if document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Try to get the file data from database first
    if document.file_data:
        return Response(
            content=document.file_data, 
            media_type=document.file_type,
            headers={
                "Content-Disposition": f"attachment; filename={document.file_name}"
            }
        )
    
    # Fallback to file system if database storage is empty
    elif document.file_path and os.path.exists(document.file_path):
        try:
            with open(document.file_path, "rb") as file:
                content = file.read()
                
            return Response(
                content=content, 
                media_type=document.file_type,
                headers={
                    "Content-Disposition": f"attachment; filename={document.file_name}"
                }
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error reading file: {str(e)}"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File content not found"
        )
