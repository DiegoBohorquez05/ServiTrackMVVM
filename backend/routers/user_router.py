from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from config.supabase import supabase

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UsuarioCreate(BaseModel):
    nombre: str
    correo: EmailStr
    password: str
    rol_id: int
    activo: bool = True

class LoginRequest(BaseModel):
    correo: EmailStr
    password: str

@router.get("/")
def get_usuarios():
    try:
        # Consultar usuarios trayendo también el nombre del rol relacionado
        response = supabase.table("usuarios") \
            .select("id, nombre, correo, rol_id, activo, roles(nombre)") \
            .execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/")
def create_usuario(usuario: UsuarioCreate):
    try:
        # 1. Verificar si intentan crear un Administrador
        # (Asumiendo que el rol_id 1 o el nombre 'Administrador' corresponden al Admin)
        rol_response = supabase.table("roles").select("nombre").eq("id", usuario.rol_id).execute()
        if rol_response.data and rol_response.data[0]["nombre"].lower() == "administrador":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No está permitido crear usuarios con el rol de Administrador."
            )

        # 2. Verificar si el correo ya existe
        existing = supabase.table("usuarios").select("id").eq("correo", usuario.correo).execute()
        if existing.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El correo electrónico ya está registrado."
            )

        # 3. Encriptar contraseña y guardar
        hashed_password = pwd_context.hash(usuario.password)

        usuario_data = usuario.dict()
        usuario_data["password"] = hashed_password

        response = supabase.table("usuarios").insert(usuario_data).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="No se pudo crear el usuario")

        nuevo_usuario = response.data[0]
        del nuevo_usuario["password"]
        return {"message": "Usuario creado exitosamente", "usuario": nuevo_usuario}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
def login(credentials: LoginRequest):
    try:
        response = supabase.table("usuarios") \
            .select("id, nombre, correo, password, rol_id, activo, roles(nombre)") \
            .eq("correo", credentials.correo) \
            .execute()

        if not response.data or not pwd_context.verify(credentials.password, response.data[0]["password"]):
            raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

        usuario = response.data[0]
        if not usuario.get("activo", True):
            raise HTTPException(status_code=403, detail="El usuario se encuentra inactivo")

        del usuario["password"]
        return {"message": "Inicio de sesión exitoso", "usuario": usuario}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))