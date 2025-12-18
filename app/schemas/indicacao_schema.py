from pydantic import BaseModel

class IndicacaoCreate(BaseModel):
    titulo: str
    categoria: str
    grupo_id: int

class IndicacaoResponse(IndicacaoCreate):
    id: int

    class Config:
        from_attributes = True
