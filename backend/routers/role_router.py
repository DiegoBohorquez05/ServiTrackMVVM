from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.database import get_db
from services.role_service import get_all_roles

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.get("/", response_model=list)
def listar_roles(db: Session = Depends(get_db)):
    """Endpoint para obtener la lista de roles"""
    roles = get_all_roles(db)
    return roles