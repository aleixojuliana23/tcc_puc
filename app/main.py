from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from app.models.grupo_model import Grupo
from app.models.indicacao_model import Indicacao
from app.routes import grupo_routes, indicacao_routes

app = FastAPI(
    title="AquiPerto API",
    description="API para grupos e indicações locais",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(grupo_routes.router)
app.include_router(indicacao_routes.router)


@app.get("/")
def root():
    return {"status": "API funcionando"}
