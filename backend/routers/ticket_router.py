from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from config.supabase import supabase

router = APIRouter(prefix="/tickets", tags=["Tickets"])

class TicketCreate(BaseModel):
    titulo: str
    descripcion: str
    categoria: str  # Área afectada (Redes, Hardware, Software, etc.)
    prioridad: str = "Media"  # Baja, Media, Alta
    cliente_id: int

@router.get("/")
@router.get("/")
def get_tickets(cliente_id: Optional[int] = None):
    try:
        # Intentamos traer los tickets con la relación del usuario
        query = supabase.table("tickets").select("id, titulo, descripcion, categoria, prioridad, estado, cliente_id, created_at, usuarios(nombre, correo)")

        if cliente_id:
            query = query.eq("cliente_id", cliente_id)

        response = query.execute()
        return response.data
    except Exception as e:
        # Si por alguna razón la relación da error de esquema, hacemos un respaldo consultando solo los tickets sin JOIN
        try:
            fallback_query = supabase.table("tickets").select("*")
            if cliente_id:
                fallback_query = fallback_query.eq("cliente_id", cliente_id)
            fallback_response = fallback_query.execute()
            return fallback_response.data
        except Exception as err:
            raise HTTPException(status_code=500, detail=str(err))

@router.post("/")
def create_ticket(ticket: TicketCreate):
    try:
        ticket_data = {
            "titulo": ticket.titulo,
            "descripcion": ticket.descripcion,
            "categoria": ticket.categoria,
            "prioridad": ticket.prioridad,
            "estado": "Abierto",  # Estado inicial por defecto
            "cliente_id": ticket.cliente_id
        }

        response = supabase.table("tickets").insert(ticket_data).execute()

        if not response.data:
            raise HTTPException(status_code=400, detail="No se pudo crear el ticket en la base de datos")

        return {
            "message": "Ticket creado exitosamente",
            "ticket": response.data[0]
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))