from fastapi import FastAPI


#Importando todos los enrutamientos de la app
from routes.OT import ot


app = FastAPI()

app.include_router(ot)