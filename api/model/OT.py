from pydantic import BaseModel, Field, model_validator
from typing import Union
from bson import ObjectId
from datetime import datetime as dt
from config import DT_FORMAT
from db import db
from services.PA_Regressor.PA_Regressor import determinar_personal
from services.MongoDB_Pipes.MongoDB_Pipes import OT_With_Full_Data

class OT(BaseModel):
    producto: str
    cantidad: int
    inicio: str
    final: str
    personalForecast: int
    personalAsignado: list[str] = Field(default_factory=list)

    _id: Union[str, ObjectId, None] = None

    # Atributos no requeridos para la instanciacion
    __status: Union[int, None] = None
    __tiempo: Union[int, None] = None
    __material_tpu: int = None

    def json(self):
        return {
            'producto':self.producto,
            'cantidad':self.cantidad,
            'inicio':self.inicio,
            'final':self.final,
            'personalForecast':self.personalForecast,
            'personalAsignado':self.personalAsignado,
            '_id':str(self._id)
        }
    
    
    def guardar(self):
        print(self._id)
        if self._id:
                
            db.ordenes.update_one({'_id':ObjectId(self._id)}, {"$set": self.json()})
            return 'Modificado'
        else:

            if not self.personalForecast:
                self._set_forecast()
                
            r = db.ordenes.insert_one(self.json())
            return str(r.inserted_id)
    
    def determinar_tiempo(self) -> float:
        if self.inicio:
            if self.final:
                return (dt.strptime(self.final, DT_FORMAT) - dt.strptime(self.inicio, DT_FORMAT)).total_seconds() / 3600
            else:
                return (dt.now() - dt.strptime(self.inicio, DT_FORMAT)).total_seconds() / 3600
        else:
            return 0
    
    def _determinar_tpu(self):
        return db.materiales.find_one({'_id':ObjectId(self.producto)}).get('tpu')
    
    def _set_forecast(self):
        return int(determinar_personal(self.determinar_tiempo(), self._determinar_tpu(), self.cantidad))
    

    @staticmethod
    def filtrar(query_prev, query_post, top = 20):
        results=list(db.ordenes.aggregate(OT_With_Full_Data(query_prev,query_post, top)))
        results=[{**r, "personalAsignado":[] if r['personalAsignado'][0]['_id']==None else r['personalAsignado']} for r in results]
        results=[{**r, "status":OT.determinar_status(r['inicio'], r['final'], r['personalAsignado'])} for r in results]

        results = list(filter(lambda x: x['_id'] != None, results))
        
        return results
    
    @staticmethod
    def determinar_status(inicio, final, personalAsignado) -> int:
        if not personalAsignado: return -1
        if dt.strptime(inicio, DT_FORMAT) <= dt.now():
            if final and dt.strptime(final, DT_FORMAT) <= dt.now():
                return 2
            else:
                return 1
        else:
            return 0

    @staticmethod
    def get_by_id(id):
        pass