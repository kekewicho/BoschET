import joblib


model = joblib.load('services/PA_Regressor/random_forest.pkl')


def determinar_personal(tiempo, tpu, cantidad) -> float:
    return model.predict([[tiempo, tpu, cantidad]])[0]



# import joblib
# from google.cloud import storage

# def cargar_modelo_desde_gcs(bucket_name, blob_name):
#     """Carga un modelo desde un bucket de Google Cloud Storage.

#     Args:
#         bucket_name: Nombre del bucket de Google Cloud Storage.
#         blob_name: Nombre del blob (archivo) dentro del bucket.

#     Returns:
#         El modelo cargado.
#     """

#     storage_client = storage.Client()
#     bucket = storage_client.bucket(bucket_name)
#     blob = bucket.blob(blob_name)
#     blob.download_to_filename('temp_model.pkl')  # Descarga temporalmente el modelo
#     model = joblib.load('temp_model.pkl')  # Carga el modelo desde el archivo temporal
#     return model

# # Reemplaza con los nombres de tu bucket y blob
# bucket_name = 'tu_bucket_name'
# blob_name = 'modelos/random_forest.pkl'

# model = cargar_modelo_desde_gcs(bucket_name, blob_name)

# def determinar_personal(tiempo, tpu, cantidad) -> float:
#     return model.predict([[tiempo, tpu, cantidad]])[0]