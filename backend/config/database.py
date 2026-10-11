from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://postgres:gFy@v77Fx.SCbLm@db.ecaotydalwvwjzlwxmuv.supabase.co:5432/postgres"

# Creamos el motor de base de datos para PostgreSQL (Supabase)
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Sesión para interactuar con la BD
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base declarativa para los modelos ORM
Base = declarative_base()

# Dependencia para obtener la sesión de BD en los endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()