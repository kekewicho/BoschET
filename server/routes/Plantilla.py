from fastapi import APIRouter, HTTPException
from typing import List, Optional
from bson import ObjectId
from db import db 
from model.Colaborador import Colaborador
from datetime import datetime as dt
from datetime import timedelta as td
from config import DT_FORMAT

pla = APIRouter(prefix="/api/plantilla", tags=["materiales"])

@pla.get("/")
async def listar_materiales():
    return Colaborador.get_all()
