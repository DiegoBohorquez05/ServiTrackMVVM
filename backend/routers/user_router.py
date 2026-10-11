from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from services.user_service import get_all_users, get_user_by_id

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.get("/", response_model=list)
def listar_usuarios(db: Session = Depends(get_db)):
    """Endpoint para listar todos los usuarios"""
    return get_all_users(db)

@router.get("/{user_id}")
def obtener_usuario(user_id: str, db: Session = Depends(get_db)):
    """Endpoint para buscar un usuario por su ID"""
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user