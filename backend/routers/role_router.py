from fastapi import APIRouter, HTTPException
from config.supabase import supabase
from schemas.schemas import RolBase, RolResponse

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.get("/", response_model=list[RolResponse])
def get_roles():
    try:
        response = supabase.table("roles").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=RolResponse)
def create_rol(rol: RolBase):
    try:
        response = supabase.table("roles").insert(rol.dict()).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="No se pudo crear el rol")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))