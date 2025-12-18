from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Indicacao(Base):
    __tablename__ = "indicacoes"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    categoria = Column(String, nullable=False)
    grupo_id = Column(Integer, ForeignKey("grupos.id"))
