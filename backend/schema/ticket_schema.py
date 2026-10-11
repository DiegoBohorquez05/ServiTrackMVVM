from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from datetime import datetime

class TicketCreate(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    categoria: Optional[str] = None
    prioridad: Optional[str] = None
    estado: Optional[str] = "Abierto"
    usuario_id: str
    respuesta_ia: Optional[str] = None
    solucion_final: Optional[str] = None
    historial_respuestas: Optional[list] = []

class TicketResponse(TicketCreate):
    id: int
    created_at: datetime

    # ¡Asegúrate de que esto esté bien indentado dentro de la clase!
    model_config = ConfigDict(from_attributes=True)