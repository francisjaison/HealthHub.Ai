# HealthHub API Backend

This directory contains the backend API for the HealthHub health management platform.

## Features

- User authentication and authorization
- Health records management
- Document file storage (supports database and filesystem storage)
- Appointment scheduling
- Disease risk assessment
- Diet and fitness tracking
- AI chat assistance

## Setup Instructions

### Prerequisites

- Python 3.8+
- PostgreSQL 12+
- Virtual environment (recommended)

### Installation

1. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set up environment variables:

Create a `.env` file in the backend directory with the following:

```
DATABASE_URL=postgresql://username:password@localhost/healthhub
SECRET_KEY=your_secret_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

4. Create the database:

```sql
CREATE DATABASE healthhub;
```

5. Apply database migrations:

```bash
alembic upgrade head
```

### Document Storage Configuration

The HealthHub backend supports storing document files in two ways:

1. **Database Storage**: Files are stored directly in the database as binary data.
2. **File System Storage**: Files are stored on the server's file system.

By default, both storage methods are used for redundancy. If you want to change this behavior:

- To use only database storage: Edit the `upload_document` function in `routers/health_records.py` to skip filesystem storage.
- To use only filesystem storage: Edit the `DocumentFile` model in `models.py` to make `file_data` not nullable.

For large deployments, consider using cloud storage solutions like AWS S3 by modifying the `upload_document` function.

### Running the Server

Start the server with:

```bash
python main.py
```

The API will be available at http://localhost:8000 and the API documentation at http://localhost:8000/docs.

## API Documentation

The API documentation is available at `/docs` or `/redoc` when the server is running.

## Database Schema

### Document Files

Document files are stored in the `document_files` table:

- `id`: Primary key
- `user_id`: Foreign key to users table
- `file_name`: Original file name
- `file_path`: Path to stored file on server filesystem (nullable)
- `file_type`: MIME type of the file
- `file_size`: Size of the file in bytes
- `file_data`: Binary content of the file stored in the database (nullable)
- `category`: Type of document (Medical Record, Lab Result, etc.)
- `uploaded_at`: Timestamp of upload
- `notes`: Optional notes about the document

## Default Migration

When upgrading an existing database to support database file storage, run:

```bash
alembic upgrade head
```

This will add the `file_data` column to the `document_files` table and make the `file_path` column nullable.

## Project Structure

- **main.py**: Entry point of the application
- **models.py**: SQLAlchemy ORM models
- **schemas.py**: Pydantic schemas for request/response validation
- **database.py**: Database configuration and connection handling
- **routers/**: API route modules organized by functionality
  - **auth.py**: Authentication routes (login, signup, etc.)
  - **users.py**: User management
  - **health_records.py**: Health record management
  - **appointments.py**: Doctor appointment handling
  - **disease_predictor.py**: Disease prediction and risk assessment
  - **diet.py**: Diet planning and nutrition
  - **fitness.py**: Fitness tracking and workout plans
  - **risk_assessment.py**: Health risk analysis

## API Endpoints

The API provides endpoints for all the major functionality shown in the frontend:

- **Authentication**: User signup, login, logout
- **User Management**: Profile updates, role-based access
- **Health Records**: Create, read, update, delete personal health data
- **Appointments**: Schedule, manage, and track doctor appointments
- **Disease Prediction**: Analyze symptoms for potential diseases
- **Diet Planning**: Create meal plans, track nutrition, access recipes
- **Fitness Tracking**: Log exercises, generate workout plans
- **Risk Assessment**: Calculate health risks based on medical factors

## Security

This template implements:
- JWT-based authentication
- Password hashing
- Role-based access control
- Input validation

## Extending the API

To add new functionality:
1. Create new models in `models.py`
2. Define corresponding schemas in `schemas.py`
3. Add appropriate API routes in a new or existing router file
4. Include the router in `main.py`
