from pydantic import BaseModel

class GrupoCreate(BaseModel):
    nome: str
    descricao: str | None = None

class GrupoResponse(GrupoCreate):
    id: int

    class Config:
        from_attributes = True
