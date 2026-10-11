from sqlalchemy.orm import Session
from models.models import Rol

def get_all_roles(db: Session):
    """Obtiene todos los roles registrados en la base de datos"""
    return db.query(Rol).all()