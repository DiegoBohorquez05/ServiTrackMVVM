from sqlalchemy.orm import Session
from models.models import Ticket

def get_all_tickets(db: Session):
    """Obtiene todos los tickets registrados"""
    return db.query(Ticket).all()

def get_ticket_by_id(db: Session, ticket_id: int):
    """Busca un ticket por su ID único"""
    return db.query(Ticket).filter(Ticket.id == ticket_id).first()

def create_ticket(db: Session, ticket_data: dict):
    """Crea un nuevo ticket en la base de datos"""
    nuevo_ticket = Ticket(**ticket_data)
    db.add(nuevo_ticket)
    db.commit()
    db.refresh(nuevo_ticket)
    return nuevo_ticket