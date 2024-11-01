from pydantic import BaseModel
from typing import Union
from bson import ObjectId
from db import db


class PydanticObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not isinstance(v, ObjectId):
            raise TypeError("ObjectId required")
        return str(v)


class Material(BaseModel):
    '''
    Material que se va a fabricar.
    Forma parte de los datos maestros del sistema.
    '''
    _id: Union[str, PydanticObjectId]
    descripcion: str
    tpu: float

    def json(self):
        return {**self.__dict__, '_id': str(self._id)}
    
    @staticmethod
    def get_all():
        res = list(db.materiales.find())
        res = [{**s, '_id': str(s['_id'])} for s in res]
        return res
    
    @staticmethod
    def get_by_id(id):
        pass
