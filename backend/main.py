from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="ServiTrack API",
    description="Backend para la gestión y seguimiento de servicios (MVVM)",
    version="1.0.0"
)

# Configuración de CORS para permitir peticiones desde el frontend (Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "¡Bienvenido al backend de ServiTrack!", "status": "activo"}