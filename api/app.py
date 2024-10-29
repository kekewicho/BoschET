from fastapi import FastAPI


#Importando todos los enrutamientos de la app
from routes.OT import ot
from routes.Materiales import mat
from routes.Plantilla import pla


app = FastAPI()

app.include_router(ot)
app.include_router(mat)
app.include_router(pla)