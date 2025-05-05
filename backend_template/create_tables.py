"""
Script to create all database tables
"""
from sqlalchemy import create_engine
from models import Base
from database import SQLALCHEMY_DATABASE_URL
import alembic.config

def main():
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    
    print("Tables created. If this is an existing database, run alembic migrations instead.")
    print("To run migrations: alembic upgrade head")

if __name__ == "__main__":
    main() 