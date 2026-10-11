from sqlalchemy.orm import Session
from models.models import Usuario

def get_all_users(db: Session):
    """Obtiene todos los usuarios registrados con su respectivo rol"""
    return db.query(Usuario).all()

def get_user_by_id(db: Session, user_id: str):
    """Busca un usuario específico por su UUID"""
    return db.query(Usuario).filter(Usuario.id == user_id).first()