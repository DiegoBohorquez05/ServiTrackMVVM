from fastapi import APIRouter, HTTPException
from config.supabase import supabase
from schemas.schemas import TicketCreate, TicketResponse

router = APIRouter(prefix="/tickets", tags=["Tickets"])

@router.get("/", response_model=list[TicketResponse])
def get_tickets():
    try:
        response = supabase.table("tickets").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=TicketResponse)
def create_ticket(ticket: TicketCreate):
    try:
        response = supabase.table("tickets").insert(ticket.dict()).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="No se pudo crear el ticket")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))