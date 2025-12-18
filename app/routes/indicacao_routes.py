from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.indicacao_model import Indicacao
from app.schemas.indicacao_schema import IndicacaoCreate, IndicacaoResponse

router = APIRouter(
    prefix="/indicacoes",
    tags=["Indicações"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=IndicacaoResponse)
def criar_indicacao(dados: IndicacaoCreate, db: Session = Depends(get_db)):
    indicacao = Indicacao(**dados.model_dump())
    db.add(indicacao)
    db.commit()
    db.refresh(indicacao)
    return indicacao
