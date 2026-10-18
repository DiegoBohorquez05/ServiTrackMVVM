from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from services.pagerduty_service import reportar_incidente_operaciones

# Importar los routers existentes
from routers.user_router import router as user_router
from routers.ticket_router import router as ticket_router
from routers.role_router import router as role_router  # si lo tienes

app = FastAPI(title="ServiTrack API", version="1.0.0")

@app.middleware("http")
async def monitor_operaciones_middleware(request: Request, call_next):
    try:
        response = await call_next(request)

        # Si la API responde con un error HTTP 500 (Internal Server Error)
        if response.status_code >= 500:
            reportar_incidente_operaciones(
                summary=f"Fallo crítico en servidor: {request.method} {request.url.path} (HTTP {response.status_code})",
                severity="critical"
            )
        return response
    except Exception as exc:
        # Si ocurre una excepción no controlada en el código
        reportar_incidente_operaciones(
            summary=f"Excepción no controlada en producción: {str(exc)}",
            severity="critical"
        )
        return JSONResponse(
            status_code=500,
            content={"detail": "Error interno capturado por el sistema de operaciones de PagerDuty."}
        )

@app.get("/simular-error")
def simular_error():
    # Lanzamos una excepción no controlada intencionalmente
    raise Exception("Simulación de fallo crítico en la base de datos Supabase")

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