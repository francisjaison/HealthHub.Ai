"""
Test script to verify file storage functionality in the database.

Usage:
python test_file_storage.py

This script will:
1. Connect to the database
2. Create a test file in memory
3. Store it in the database
4. Retrieve it from the database
5. Verify the content matches
"""
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pathlib import Path
from datetime import datetime
import io
import random
import string
from dotenv import load_dotenv

# Add the current directory to the path so we can import our modules
sys.path.append('.')

# Import our models
import models
from database import get_db

# Load environment variables
load_dotenv()

def generate_test_file(size_kb=100):
    """Generate a random test file of specified size"""
    content = ''.join(random.choices(string.ascii_letters + string.digits, k=size_kb * 1024))
    return content.encode('utf-8')

def test_file_storage():
    """Test file storage in the database"""
    try:
        # Get a database session from our dependency
        db = next(get_db())
        
        print("Connected to database successfully.")
        
        # Generate a test user if none exists
        test_user = db.query(models.User).filter(models.User.email == "testuser@example.com").first()
        if not test_user:
            test_user = models.User(
                email="testuser@example.com",
                name="Test User",
                hashed_password="fakehash",  # In a real app, this would be properly hashed
                role=models.UserRole.patient
            )
            db.add(test_user)
            db.commit()
            print("Created test user.")
        
        # Generate test file content
        file_content = generate_test_file(size_kb=10)  # 10KB test file
        print(f"Generated test file of {len(file_content)} bytes.")
        
        # Create a test document
        test_doc = models.DocumentFile(
            user_id=test_user.id,
            file_name="test_file.txt",
            file_type="text/plain",
            file_size=len(file_content),
            file_data=file_content,
            category=models.DocumentType.other,
            notes="Test file for database storage"
        )
        
        # Add to database
        db.add(test_doc)
        db.commit()
        db.refresh(test_doc)
        print(f"Stored test file in database with ID: {test_doc.id}")
        
        # Retrieve from database 
        retrieved_doc = db.query(models.DocumentFile).filter(models.DocumentFile.id == test_doc.id).first()
        
        if not retrieved_doc:
            print("ERROR: Could not retrieve document from database.")
            return False
        
        # Verify file content
        if retrieved_doc.file_data == file_content:
            print("SUCCESS: Retrieved file content matches original content.")
            print(f"File size: {len(retrieved_doc.file_data)} bytes")
        else:
            print("ERROR: Retrieved file content does not match original content.")
            print(f"Original size: {len(file_content)}, Retrieved size: {len(retrieved_doc.file_data)}")
            return False
        
        # Clean up
        db.delete(test_doc)
        db.commit()
        print("Cleaned up test document.")
        
        return True
        
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("Testing file storage in database...")
    
    # Create uploads directory if it doesn't exist
    upload_dir = Path("uploads")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    success = test_file_storage()
    
    if success:
        print("\nSUCCESS: File storage test completed successfully!")
        print("Your database is correctly configured for storing files.")
    else:
        print("\nFAILED: File storage test encountered errors.")
        print("Please check the database configuration and try again.")
    
    sys.exit(0 if success else 1) 