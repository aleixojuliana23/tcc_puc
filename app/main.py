from fastapi import FastAPI

from app.database import Base, engine

# IMPORTANTE:
# importar os modelos garante que o SQLAlchemy "enxergue" as tabelas
from app.models.grupo_model import Grupo
from app.models.indicacao_model import Indicacao

# importar as rotas
from app.routes import grupo_routes, indicacao_routes

app = FastAPI(
    title="AquiPerto API",
    description="API para grupos e indicações locais",
    version="0.1.0"
)

# cria as tabelas no banco (se ainda não existirem)
Base.metadata.create_all(bind=engine)

# registra as rotas
app.include_router(grupo_routes.router)
app.include_router(indicacao_routes.router)

@app.get("/")
def root():
    return {"status": "API funcionando"}
