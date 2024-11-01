import pymongo
from dotenv import load_dotenv
import os

load_dotenv()

URI = os.getenv("MONGO_DB_URI")

client = pymongo.MongoClient(URI)

db = client.Bosch