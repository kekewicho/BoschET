from pydantic import BaseModel
from typing import Union
from bson import ObjectId


class MRPOT(BaseModel):
    '''
    La clase representa la salida de un sistema MRP que derivado de las necesidades de venta,
    nos arroja las OT necesarias para cumplir con la demanda para los determinados materiales.
    Además, se hipotetiza el tiempo de produccion hipotetico que se necesitara para seguir con
    la planificacion de la produccion.
    '''
    _id: Union[str, ObjectId]
    fechaPronostico: str
    producto: str
    cantidad: int
    tiempoProd: float

    def json(self):
        return {**self.__dict__, '_id':str(self._id)}
    
    @staticmethod
    def get_by_id(id):
        pass