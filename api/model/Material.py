from pydantic import BaseModel
from typing import Union
from bson import ObjectId


class Material(BaseModel):
    '''
    Material que se va a fabricar.
    Forma parte de los datos maestros del sistema.
    '''
    _id: Union[str, ObjectId]
    descripcion: str
    tpu: float

    def json(self):
        return {**self.__dict__, '_id':str(self._id)}
    
    @staticmethod
    def get_by_id(id):
        pass