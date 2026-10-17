from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

# Importar los routers existentes
from routers.user_router import router as user_router
from routers.ticket_router import router as ticket_router
from routers.role_router import router as role_router  # si lo tienes

app = FastAPI(title="ServiTrack API", version="1.0.0")

# Configurar CORS para permitir peticiones desde React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir los routers
app.include_router(user_router)
app.include_router(ticket_router)
if 'role_router' in locals():
    app.include_router(role_router)

# 2. Inicializar y exponer las métricas para Prometheus
Instrumentator().instrument(app).expose(app, endpoint="/metrics")