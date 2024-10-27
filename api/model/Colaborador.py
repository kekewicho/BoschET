from pydantic import BaseModel
from typing import Union
from bson import ObjectId


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
    def get_by_id(id):
        pass