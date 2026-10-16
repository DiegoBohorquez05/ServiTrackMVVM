from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from passlib.context import CryptContext
from config.supabase import supabase

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

# Configuración del contexto de contraseñas (passlib)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Modelos Pydantic
class UserCreate(BaseModel):
    nombre: str
    correo: str
    password: str
    rol_id: int
    activo: Optional[bool] = True

class UserRoleUpdate(BaseModel):
    rol_id: int

class UserLogin(BaseModel):
    correo: str
    password: str


@router.get("/")
def get_usuarios():
    try:
        response = supabase.table("usuarios").select("*, roles(nombre)").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
def create_usuario(user: UserCreate):
    try:
        # Encriptamos la contraseña antes de guardar
        hashed_password = pwd_context.hash(user.password)
        data = {
            "nombre": user.nombre,
            "correo": user.correo,
            "password": hashed_password,
            "rol_id": user.rol_id,
            "activo": user.activo
        }
        response = supabase.table("usuarios").insert(data).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="No se pudo crear el usuario")
        return {"message": "Usuario creado exitosamente", "usuario": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login")
def login(credentials: UserLogin):
    try:
        # Consultar usuario por correo incluyendo su rol
        response = supabase.table("usuarios").select("*, roles(nombre)").eq("correo", credentials.correo).execute()

        if not response.data:
            raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

        user = response.data[0]
        stored_password = user.get("password", "")

        # Validar contraseña (acepta texto plano o hash bcrypt)
        is_valid = False
        if stored_password == credentials.password:
            is_valid = True
        else:
            try:
                is_valid = pwd_context.verify(credentials.password, stored_password)
            except Exception:
                is_valid = False

        if not is_valid:
            raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

        return {
            "message": "Login exitoso",
            "usuario": {
                "id": user["id"],
                "nombre": user["nombre"],
                "correo": user["correo"],
                "rol_id": user["rol_id"],
                "roles": user.get("roles")
            }
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{usuario_id}")
@router.patch("/{usuario_id}")
def update_user_role(usuario_id: int, update_data: UserRoleUpdate):
    try:
        response = supabase.table("usuarios").update({"rol_id": update_data.rol_id}).eq("id", usuario_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return {"message": "Rol actualizado con éxito", "usuario": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))