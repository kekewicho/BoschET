from fastapi import APIRouter, HTTPException
from typing import List, Optional
from bson import ObjectId
from db import db 
from model.Material import Material
from datetime import datetime as dt
from datetime import timedelta as td
from config import DT_FORMAT

mat = APIRouter(prefix="/api/materiales", tags=["materiales"])

@mat.get("/")
async def listar_materiales():
    return Material.get_all()
