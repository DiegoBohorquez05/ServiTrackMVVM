from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from services.ticket_service import get_all_tickets, get_ticket_by_id, create_ticket
from schema.ticket_schema import TicketCreate, TicketResponse

router = APIRouter(prefix="/tickets", tags=["Tickets"])

@router.get("/", response_model=list[TicketResponse])
def listar_tickets(db: Session = Depends(get_db)):
    """Endpoint para listar todos los tickets"""
    return get_all_tickets(db)

@router.get("/{ticket_id}", response_model=TicketResponse)
def obtener_ticket(ticket_id: int, db: Session = Depends(get_db)):
    """Endpoint para buscar un ticket por su ID"""
    ticket = get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")
    return ticket

@router.post("/", response_model=TicketResponse)
def crear_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    """Endpoint para registrar un nuevo ticket"""
    return create_ticket(db, ticket.dict())