ServiTrack - Plataforma de Gestión de Soporte Técnico

ServiTrack es una plataforma web moderna para la gestión, seguimiento y resolución de incidencias y tickets de soporte técnico. Está diseñada bajo una Arquitectura de Microservicios y un enfoque distribuido utilizando el patrón MVVM, integrando asistencia mediante Inteligencia Artificial y monitoreo en tiempo real.

Arquitectura del Sistema

El proyecto está estructurado como un Monorepo desacoplado que separa las responsabilidades de interfaz, lógica de negocio, datos y observabilidad:

Frontend (React + Vite): Desplegado en Vercel. Implementa las capas de Vista (views) y ViewModel (viewmodels) para una interfaz reactiva y limpia.

Backend (FastAPI - Microservicios): Desplegado en Render. Actúa como la capa de Modelo y Lógica de Negocio, dividido por dominios independientes (Autenticación/Usuarios y Gestión de Tickets).

Base de Datos (Supabase / PostgreSQL): Almacenamiento relacional que gestiona usuarios, roles y tickets (incluyendo trazabilidad en formato JSONB y sugerencias generadas por IA).

Observabilidad y Gestión de Incidentes: Integración con Prometheus para la recolección de métricas y PagerDuty para el escalamiento y alerta de incidentes críticos.

Estructura del Proyecto
<img width="880" height="438" alt="image" src="https://github.com/user-attachments/assets/84abb1fe-1096-42e1-8176-2c237a672870" />
Funcionamiento Principal

Autenticación y Control de Acceso (RBAC):

Los usuarios inician sesión mediante credenciales validadas contra la base de datos en Supabase.

El sistema asigna permisos dinámicos según el rol (Administrador, Técnico, Cliente).

Gestión Integral de Tickets:

Creación de reportes categorizados (hardware, software, redes, seguridad) con niveles de prioridad (bajo, medio, alto).

Historial Trazable (JSONB): Cada actualización, comentario o cambio de estado se registra cronológicamente dentro de un objeto JSON en la base de datos.

Asistencia con IA (sugerencia_ia): Al registrar una incidencia, el sistema procesa la descripción para ofrecer una recomendación automatizada de diagnóstico y solución.

Monitoreo y Alertas (Prometheus & PagerDuty)

Para garantizar la alta disponibilidad y el cumplimiento de los acuerdos de nivel de servicio (SLA) de la plataforma, se implementó un pipeline de observabilidad:

1. Prometheus (Recolección de Métricas)

El backend en FastAPI expone un endpoint /metrics instrumentado para capturar telemetría en tiempo real.

Métricas clave monitoreadas:

Latencia de respuesta de los endpoints (http_request_duration_seconds).

Tasa de peticiones por segundo y códigos de estado HTTP (200, 401, 500).

Salud y disponibilidad de los servicios desplegados en Render.

2. PagerDuty (Gestión de Incidentes y Alertas)

Conectado mediante Webhooks y reglas de alerta (Alertmanager / integraciones API).

Flujo de respuesta ante fallos:

Si Prometheus detecta una caída en alguno de los microservicios, un aumento anómalo en errores 5xx o tiempos de respuesta críticos, se dispara automáticamente una alerta hacia PagerDuty.

PagerDuty clasifica la severidad del incidente, notifica al equipo técnico de guardia y registra el ciclo de vida hasta su resolución.

Instalación y Despliegue Local

Requisitos previos

Node.js (v18+)

Python (v3.10+)

Cuenta y credenciales de Supabase

1. Configurar el Backend
<img width="881" height="157" alt="image" src="https://github.com/user-attachments/assets/2927d27d-9dbc-418e-95b2-20c839ddf6d2" />

2. Configurar el Frontend
<img width="882" height="300" alt="image" src="https://github.com/user-attachments/assets/9d01e185-adb7-417c-b7d3-f536495449da" />

Nota: Este proyecto fue desarrollado como proyecto de clase con el objetivo de entender y trabajar con microservicios e integración de una inteligencia artificial a un sistema creado desde cero, a su vez, este proyecto fue diseñado, estructurado e implementado por el equipo de desarrollo, utilizando herramientas de Inteligencia Artificial (Gemini) como asistente de apoyo para la optimización de código, depuración de despliegues y documentación técnica.
