from fastapi import APIRouter, HTTPException
from config.supabase import supabase
from schemas.schemas import UsuarioCreate, UsuarioResponse

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.get("/", response_model=list[UsuarioResponse])
def get_usuarios():
    try:
        response = supabase.table("usuarios").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=UsuarioResponse)
def create_usuario(usuario: UsuarioCreate):
    try:
        response = supabase.table("usuarios").insert(usuario.dict()).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="No se pudo crear el usuario")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))