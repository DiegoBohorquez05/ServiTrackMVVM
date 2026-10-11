from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from config.database import Base
import datetime

class Rol(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, nullable=False)

    # Relación opcional inversa hacia usuarios
    usuarios = relationship("Usuario", back_populates="rol")


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(UUID(as_uuid=True), primary_key=True)
    nombre = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    rol_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    # Relaciones
    rol = relationship("Rol", back_populates="usuarios")
    tickets = relationship("Ticket", back_populates="usuario")


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    descripcion = Column(Text)
    categoria = Column(String)
    prioridad = Column(String)
    estado = Column(String)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey("usuarios.id"), nullable=False)
    respuesta_ia = Column(Text)
    solucion_final = Column(Text)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    historial_respuestas = Column(JSONB)

    # Relación con usuario
    usuario = relationship("Usuario", back_populates="tickets")