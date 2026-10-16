from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from config.supabase import supabase

router = APIRouter(prefix="/tickets", tags=["Tickets"])

class TicketCreate(BaseModel):
    titulo: str
    descripcion: str
    categoria: str
    prioridad: str = "Media"
    cliente_id: int

class TicketUpdate(BaseModel):
    respuesta: Optional[str] = None
    estado: Optional[str] = None
    autor: Optional[str] = "Técnico"  # Puede ser "Cliente" o "Técnico"

@router.get("/")
def get_tickets(cliente_id: Optional[int] = None):
    try:
        query = supabase.table("tickets").select("*, usuarios(nombre, correo)")
        if cliente_id:
            query = query.eq("cliente_id", cliente_id)
        response = query.execute()
        return response.data
    except Exception as e:
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
            "estado": "Abierto",
            "cliente_id": ticket.cliente_id,
            "historial": []
        }
        response = supabase.table("tickets").insert(ticket_data).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="No se pudo crear el ticket")
        return {"message": "Ticket creado exitosamente", "ticket": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{ticket_id}")
@router.patch("/{ticket_id}")
def update_ticket(ticket_id: int, ticket: TicketUpdate):
    try:
        current = supabase.table("tickets").select("historial, estado").eq("id", ticket_id).execute()
        if not current.data:
            raise HTTPException(status_code=404, detail="Ticket no encontrado")

        ticket_actual = current.data[0]
        historial_actual = ticket_actual.get("historial") or []
        data_to_update = {}

        if ticket.respuesta:
            nueva_respuesta = {
                "mensaje": ticket.respuesta,
                "fecha": datetime.now().isoformat(),
                "autor": ticket.autor or "Usuario"
            }
            historial_actual.append(nueva_respuesta)
            data_to_update["historial"] = historial_actual

        if ticket.estado:
            data_to_update["estado"] = ticket.estado

        if not data_to_update:
            raise HTTPException(status_code=400, detail="No hay datos para actualizar")

        response = supabase.table("tickets").update(data_to_update).eq("id", ticket_id).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="No se pudo actualizar el ticket")

        return {"message": "Ticket actualizado exitosamente", "ticket": response.data[0]}

    except HTTPException as he:
        raise he
    except Exception as e:
        print("Error en update_ticket:", str(e))
        raise HTTPException(status_code=500, detail=str(e))