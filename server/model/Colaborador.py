from pydantic import BaseModel
from typing import Union
from bson import ObjectId
from db import db


class Colaborador(BaseModel):
    '''
    Abstraccion de personal de planta que será asignado a las ordenes de trabajo.
    Forma parte de los datos maestros del sistema.
    '''
    _id: Union[str, ObjectId]
    nombre: str
    foto:str

    def json(self):
        return {**self.__dict__, '_id':str(self._id)}
    
    @staticmethod
    def get_all():
        res = list(db.plantilla.find())
        res = [{**s, '_id': str(s['_id'])} for s in res]
        return res
    
    @staticmethod
    def get_by_id(id):
        pass