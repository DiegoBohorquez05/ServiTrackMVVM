from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.database import engine
from routers import role_router, user_router, ticket_router  # Importamos ticket_router

app = FastAPI(
    title="ServiTrack API",
    description="Backend para la gestión y seguimiento de servicios (MVVM)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir todas las rutas
app.include_router(role_router.router)
app.include_router(user_router.router)
app.include_router(ticket_router.router)

@app.get("/")
def read_root():
    return {"message": "¡Bienvenido al backend de ServiTrack!", "status": "activo"}