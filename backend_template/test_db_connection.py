"""
Test database connection
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import psycopg2
from sqlalchemy import create_engine, text

def main():
    print("="*50)
    print("DATABASE CONNECTION TEST")
    print("="*50)
    
    # 1. Test environment variable loading
    print("\n1. Testing .env file loading:")
    env_file = Path(__file__).parent / ".env"
    if not env_file.exists():
        print(f"[ERROR] .env file not found at {env_file}")
        print("[INFO] Creating a new .env file from your template...")
        with open("supabase-env-template.txt", "r") as template_file:
            template_content = template_file.read()
        with open(env_file, "w") as new_env_file:
            new_env_file.write(template_content)
        print(f"[INFO] New .env file created at {env_file}")
    
    # Try to load environment variables
    print(f"[INFO] Loading environment variables from {env_file}")
    load_dotenv(dotenv_path=env_file)
    
    # 2. Check DATABASE_URL
    print("\n2. Checking DATABASE_URL:")
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("[ERROR] DATABASE_URL environment variable not found")
        sys.exit(1)
    
    # Print a masked version of the connection string for security
    masked_url = db_url.replace(db_url.split("@")[0].split(":")[-1], "****")
    print(f"[INFO] DATABASE_URL found: {masked_url}")
    
    # 3. Test direct PostgreSQL connection with psycopg2
    print("\n3. Testing direct connection with psycopg2:")
    try:
        print("[INFO] Connecting to PostgreSQL database...")
        conn = psycopg2.connect(db_url)
        print("[SUCCESS] Direct connection successful!")
        
        # Test a simple query
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        print(f"[INFO] PostgreSQL version: {version[0]}")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"[ERROR] Direct connection failed: {str(e)}")
        
        # Additional debug info for common errors
        if "password authentication failed" in str(e).lower():
            print("\n[HINT] The password in your DATABASE_URL appears to be incorrect.")
            print("[HINT] Double-check your Supabase database password.")
        
        if "could not connect" in str(e).lower() or "connection refused" in str(e).lower():
            print("\n[HINT] Could not reach the database server.")
            print("[HINT] Possible reasons:")
            print("  - The host is incorrect in your DATABASE_URL")
            print("  - There's a network issue (Supabase IP restrictions?)")
            print("  - The database service might be down")
    
    # 4. Test SQLAlchemy connection
    print("\n4. Testing SQLAlchemy connection:")
    try:
        print("[INFO] Connecting via SQLAlchemy...")
        engine = create_engine(db_url)
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("[SUCCESS] SQLAlchemy connection successful!")
    except Exception as e:
        print(f"[ERROR] SQLAlchemy connection failed: {str(e)}")
    
    print("\n5. Dependency check:")
    try:
        import sqlalchemy
        print(f"[INFO] SQLAlchemy version: {sqlalchemy.__version__}")
    except ImportError:
        print("[ERROR] SQLAlchemy not installed. Run: pip install sqlalchemy")
    
    try:
        import psycopg2
        print(f"[INFO] psycopg2 version: {psycopg2.__version__}")
    except ImportError:
        print("[ERROR] psycopg2 not installed. Run: pip install psycopg2-binary")
    
    print("\n"+"="*50)
    print("TEST COMPLETED")
    print("="*50)

if __name__ == "__main__":
    main() 