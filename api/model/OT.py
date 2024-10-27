from pydantic import BaseModel
from typing import Union
from bson import ObjectId
from datetime import datetime as dt
from config import DT_FORMAT

class OT(BaseModel):
    _id: Union[str, ObjectId]
    producto: str
    cantidad: int
    personalAsignado: list[int]
    inicio:Union[str, None] = None
    final:Union[str, None] = None

    def json(self):
        return {**self.__dict__, '_id':str(self._id)}
    
    def determinar_tiempo(self) -> float:
        if self.inicio:
            if self.final:
                return (dt.strptime(self.final, DT_FORMAT) - dt.strptime(self.inicio, DT_FORMAT)).total_seconds() / 60
            else:
                return (dt.now() - dt.strptime(self.inicio, DT_FORMAT)).total_seconds() / 60
        else:
            0


    @staticmethod
    def get_by_id(id):
        pass
