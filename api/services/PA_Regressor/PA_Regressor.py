from google.cloud import storage
import joblib
import os
import io
from google.oauth2 import service_account
from dotenv import load_dotenv

load_dotenv()

def load_model_from_gcs():
    credentials = service_account.Credentials.from_service_account_info({
        "type": os.getenv('GCP_TYPE'),
        "project_id": os.getenv('GCP_PROJECT_ID'),
        "private_key_id": os.getenv('GCP_PRIVATE_KEY_ID'),
        "private_key": os.getenv('GCP_PRIVATE_KEY').replace('\\n', '\n'),
        "client_email": os.getenv('GCP_CLIENT_EMAIL'),
        "client_id": os.getenv('GCP_CLIENT_ID'),
        "auth_uri": os.getenv('GCP_AUTH_URI'),
        "token_uri": os.getenv('GCP_TOKEN_URI'),
        "auth_provider_x509_cert_url": os.getenv('GCP_AUTH_PROVIDER_CERT_URL'),
        "client_x509_cert_url": os.getenv('GCP_CLIENT_CERT_URL')
    })

    client = storage.Client(credentials=credentials)
    bucket_name = os.getenv('GCS_BUCKET_NAME')
    model_path = os.getenv('CGS_MODEL_FILE')
    
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(model_path)
    
    model_data = io.BytesIO()
    blob.download_to_file(model_data)
    model_data.seek(0)
    
    model = joblib.load(model_data)
    
    return model

model = load_model_from_gcs()

def determinar_personal(tiempo, tpu, cantidad) -> float:
    return model.predict([[tiempo, tpu, cantidad]])[0]
