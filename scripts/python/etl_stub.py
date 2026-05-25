# scripts/python/etl_stub.py
import os
import logging
import pandas as pd
from pymongo import MongoClient
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(message)s'
)
logger = logging.getLogger(__name__)

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME", "data_narrative")

def get_db():
    if not MONGODB_URI:
        raise EnvironmentError("MONGODB_URI is not set.")
    client = MongoClient(MONGODB_URI)
    return client[DB_NAME]

def load_and_clean(source_path: str) -> pd.DataFrame:
    logger.info(f"Loading dataset from {source_path}")
    df = pd.read_csv(source_path)
    
    # Basic cleaning & type coercion
    df.dropna(inplace=True)
    if 'timestamp' in df.columns:
        df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
    
    logger.info(f"Cleaned records: {len(df)}")
    return df

def ingest_to_mongo(db, collection_name: str, df: pd.DataFrame):
    collection = db[collection_name]
    records = df.to_dict(orient='records')
    if records:
        collection.insert_many(records)
    logger.info(f"Successfully ingested {len(records)} documents into '{collection_name}'.")

def update_dataset_registry(db, slug: str, record_count: int):
    registry = db['datasets']
    registry.update_one(
        {"slug": slug},
        {"$set": {"recordCount": record_count, "lastIngested": datetime.utcnow()}},
        upsert=True
    )
    logger.info(f"Updated registry for dataset slug: {slug}")

def run_pipeline(config: dict):
    db = get_db()
    df = load_and_clean(config['source'])
    ingest_to_mongo(db, config['collection'], df)
    update_dataset_registry(db, config['slug'], len(df))
    logger.info("Pipeline execution completed.")

if __name__ == "__main__":
    # Example execution configuration
    pipeline_cfg = {
        "source": "data/youtube_trends_sample.csv",
        "collection": "dataset_youtube_trends_v1",
        "slug": "youtube-trend-intelligence"
    }
    run_pipeline(pipeline_cfg)