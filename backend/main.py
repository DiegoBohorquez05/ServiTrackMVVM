from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import role_router, user_router, ticket_router

app = FastAPI(title="ServiTrack API (Direct Supabase)", version="2.0")

# Configurar CORS para permitir peticiones del frontend (React / Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción puedes restringirlo a tu dominio o puerto de frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar los routers
app.include_router(role_router.router)
app.include_router(user_router.router)
app.include_router(ticket_router.router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a ServiTrack API - Conectado directo a Supabase"}