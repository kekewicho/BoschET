from fastapi import APIRouter, HTTPException
from typing import List, Optional
from bson import ObjectId
from db import db 
from model.OT import OT 
from datetime import datetime as dt
from datetime import timedelta as td
from config import DT_FORMAT

ot = APIRouter(prefix="/api/ordenes", tags=["ordenes"])

@ot.post("/guardar")
async def crear_orden(orden: OT):
    # try:

    orden_id = orden.guardar()
    return orden_id
    # except Exception as e:
    #     raise HTTPException(status_code=400, detail=str(e))

@ot.get("/{id}")
async def obtener_orden(id: str):
    try:
        orden = OT.get_by_id(id)
        if not orden:
            raise HTTPException(status_code=404, detail="Orden no encontrada")
        return orden
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@ot.get("/")
async def listar_ordenes(top: Optional[int] = 20, fechaInicial:Optional[str] = None, fechaFinal:Optional[str] = None,
                         searchString : Optional[str]=None):

    query_prev = []
    query_post = []

    query_prev.append({'inicio': {'$lte':fechaFinal if fechaFinal != None else dt.now().strftime(DT_FORMAT)}})
    query_prev.append({'inicio': {'$gte':fechaInicial if fechaInicial != None else (dt.now()-td(days=30)).strftime(DT_FORMAT)}})

    
    if searchString:
        query_post.append({'searchString':{"$regex":searchString, "$options":"i"}})
    

    ordenes = OT.filtrar(query_prev, query_post,top=top)

    return ordenes

@ot.delete("/{id}", response_model=str)
async def eliminar_orden(id: str):
    try:
        result = db.ordenes.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Orden no encontrada")
        return f"Orden {id} eliminada"
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@ot.post('/previsionForecast')
async def prevision(orden: OT):
    forecast = orden._set_forecast()
    
    return {'forecast':forecast}
