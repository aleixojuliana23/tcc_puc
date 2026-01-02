from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.grupo_model import Grupo
from app.schemas.grupo_schema import (
    GrupoCreate,
    GrupoResponse,
)


router = APIRouter(prefix="/grupos", tags=["Grupos"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Endpoint para criar um novo grupo
@router.post("/", response_model=GrupoResponse, status_code=status.HTTP_201_CREATED)
def criar_grupo(grupo: GrupoCreate, db: Session = Depends(get_db)):
    db_grupo = Grupo(nome=grupo.nome, descricao=grupo.descricao)
    db.add(db_grupo)
    db.commit()
    db.refresh(db_grupo)
    return db_grupo


# Endpoint para listar todos os grupos
@router.get("/", response_model=list[GrupoResponse])
def listar_grupos(db: Session = Depends(get_db)):
    grupos = db.query(Grupo).all()
    return grupos


# ESTE É O ENDPOINT CRÍTICO QUE ESTAMOS VERIFICANDO
# Endpoint para obter um grupo por ID
@router.get(
    "/{grupo_id}", response_model=GrupoResponse
)  # <--- ESTE DECORADOR É FUNDAMENTAL
def obter_grupo(grupo_id: int, db: Session = Depends(get_db)):
    grupo = db.query(Grupo).filter(Grupo.id == grupo_id).first()
    if grupo is None:
        # Retorna 404 se o grupo não for encontrado
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Grupo não encontrado"
        )
    return grupo


# Exemplo de endpoint para deletar um grupo (opcional, mas bom para testar)
@router.delete("/{grupo_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_grupo(grupo_id: int, db: Session = Depends(get_db)):
    grupo = db.query(Grupo).filter(Grupo.id == grupo_id).first()
    if grupo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Grupo não encontrado"
        )
    db.delete(grupo)
    db.commit()
    return {"message": "Grupo deletado com sucesso"}
