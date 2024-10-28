import joblib
from typing import Union


model = joblib.load('services\\PA_Regressor\\random_forest.pkl')


def determinar_personal(data) -> float:
    return model.predict([[data.__tiempo, data.__material_tpu, data.cantidad]])[0]