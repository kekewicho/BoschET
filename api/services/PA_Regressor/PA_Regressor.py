import joblib
from typing import Union


model = joblib.load('services/PA_Regressor/random_forest.pkl')


def determinar_personal(tiempo, tpu, cantidad) -> float:
    return model.predict([[tiempo, tpu, cantidad]])[0]