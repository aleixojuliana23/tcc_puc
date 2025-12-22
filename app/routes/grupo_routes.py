from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.grupo_model import Grupo
from app.schemas.grupo_schema import GrupoCreate, GrupoResponse

router = APIRouter(prefix="/grupos", tags=["Grupos"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=GrupoResponse)
def criar_grupo(dados: GrupoCreate, db: Session = Depends(get_db)):
    grupo = Grupo(**dados.model_dump())
    db.add(grupo)
    db.commit()
    db.refresh(grupo)
    return grupo


@router.get("/", response_model=list[GrupoResponse])
def listar_grupos(db: Session = Depends(get_db)):
    return db.query(Grupo).all()
