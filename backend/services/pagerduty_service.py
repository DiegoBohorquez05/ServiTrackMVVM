import os
import requests
from dotenv import load_dotenv

load_dotenv()

PAGERDUTY_ROUTING_KEY = os.getenv("PAGERDUTY_ROUTING_KEY")
PAGERDUTY_EVENTS_URL = "https://events.pagerduty.com/v2/enqueue"

def reportar_incidente_operaciones(summary: str, severity: str = "critical", source: str = "ServiTrack-Backend"):
    if not PAGERDUTY_ROUTING_KEY:
        print("⚠️ PAGERDUTY_ROUTING_KEY no configurada en .env.")
        return

    payload = {
        "routing_key": PAGERDUTY_ROUTING_KEY,
        "event_action": "trigger",
        "payload": {
            "summary": summary,
            "severity": severity,  # critical, error, warning, info
            "source": source,
            "component": "API-FastAPI / Supabase",
            "group": "Produccion"
        }
    }

    try:
        response = requests.post(PAGERDUTY_EVENTS_URL, json=payload, timeout=5)
        if response.status_code == 202:
            print("🚨 [OPERATE / PAGERDUTY] ¡Alerta de incidente enviada exitosamente a PagerDuty!")
        else:
            print(f"❌ [PAGERDUTY] Error al enviar alerta: {response.text}")
    except Exception as e:
        print(f"❌ [PAGERDUTY] Fallo de conexión con la API de PagerDuty: {e}")

