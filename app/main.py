from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .database import engine, Base
from .models import grupo_model
from .models import indicacao_model

from .routes import grupo_routes, indicacao_routes

app = FastAPI()

Base.metadata.create_all(bind=engine)


app.include_router(grupo_routes.router)
app.include_router(indicacao_routes.router)


app.mount("/static", StaticFiles(directory="frontend"), name="static")


@app.get("/")
async def serve_pagina_inicial():
    return FileResponse("frontend/pagina_inicial_comunidades.html")


@app.get("/api-status")
def read_root():
    return {"message": "Bem-vindo à API AquiPerto!"}
