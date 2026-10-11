from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- ROLES ---
class RolBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None

class RolResponse(RolBase):
    id: int

    class Config:
        from_attributes = True

# --- USUARIOS ---
class UsuarioBase(BaseModel):
    nombre: str
    correo: EmailStr
    rol_id: Optional[int] = None
    activo: Optional[bool] = True

class UsuarioCreate(UsuarioBase):
    password: str

class UsuarioResponse(UsuarioBase):
    id: int

    class Config:
        from_attributes = True

# --- TICKETS ---
class TicketBase(BaseModel):
    titulo: str
    descripcion: str
    estado: Optional[str] = "Abierto"
    prioridad: Optional[str] = "Media"
    usuario_id: Optional[int] = None
    historial: Optional[List[Dict[str, Any]]] = []

class TicketCreate(TicketBase):
    pass

class TicketResponse(TicketBase):
    id: int
    creado_en: Optional[datetime] = None

    class Config:
        from_attributes = True