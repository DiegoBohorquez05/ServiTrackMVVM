import os
import time
from google import genai
from dotenv import load_dotenv

load_dotenv()

def generar_respuesta_contencion(titulo: str, descripcion: str, categoria: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        print("❌ Error: GEMINI_API_KEY no encontrada en .env")
        return "Hola, recibimos tu solicitud. Un integrante del equipo de soporte revisará tu caso en breve."

    prompt = f"""
Eres un agente de nivel 1 de soporte técnico de IT para ServiTrack.
Proporciona un diagnóstico breve y 3 pasos de solución concisos para:
Categoría: {categoria}
Título: {titulo}
Descripción: {descripcion}
"""

    client = genai.Client(api_key=api_key)

    # Reintentos con gemini-3.5-flash-lite
    for intento in range(3):
        try:
            print(f"🤖 [IA] Intentando con gemini-3.5-flash-lite (Intento {intento + 1}/3)...")
            response = client.models.generate_content(
                model='gemini-3.5-flash-lite',
                contents=prompt,
            )

            if response and response.text:
                print("✅ [IA] Respuesta generada exitosamente por gemini-3.5-flash-lite.")
                return response.text.strip()

        except Exception as e:
            print(f"⚠️ [IA] Error en gemini-3.5-flash-lite (Intento {intento + 1}): {e}")
            time.sleep(1.5)

    print("❌ [IA] Los 3 intentos con Gemini fallaron.")
    return "Hola, recibimos tu solicitud. Un integrante del equipo de soporte revisará tu caso en breve."