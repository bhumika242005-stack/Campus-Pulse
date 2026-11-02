
import json
import uuid
import time
from datetime import datetime, timezone
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from kafka import KafkaProducer
from kafka.errors import KafkaError


KAFKA_SERVER = "localhost:9092"
TOPIC_NAME = "campus-events"

producer = None


class CampusEvent(BaseModel):
    student_id: str
    zone: str
    event_type: str


def connect_to_kafka(max_attempts=5):
    global producer

    for attempt in range(1, max_attempts + 1):
        try:
            producer = KafkaProducer(
                bootstrap_servers=KAFKA_SERVER,
                value_serializer=lambda value: json.dumps(value).encode("utf-8"),
                request_timeout_ms=10000,
                retries=5,
                retry_backoff_ms=1000
            )
            print("Connected to Kafka!")
            return True

        except Exception as e:
            print(f"Kafka connection attempt {attempt} failed: {e}")
            producer = None

            if attempt < max_attempts:
                time.sleep(3)

    print("Could not connect to Kafka after multiple attempts.")
    return False


@asynccontextmanager
async def lifespan(app: FastAPI):
    connect_to_kafka()

    yield

    global producer
    if producer is not None:
        producer.flush()
        producer.close()
        print("Kafka producer closed.")


app = FastAPI(lifespan=lifespan)


@app.get("/")
def home():
    return {"message": "Campus Pulse API is running"}


@app.post("/events")
def receive_event(event: CampusEvent):
    global producer

    if event.zone not in ["Library", "Canteen", "Lab"]:
        raise HTTPException(status_code=400, detail="Invalid zone")

    if event.event_type not in ["check_in", "check_out"]:
        raise HTTPException(status_code=400, detail="Invalid event type")

    if producer is None:
        if not connect_to_kafka():
            raise HTTPException(
                status_code=503,
                detail="Kafka is unavailable. Please try again later."
            )

    event_data = {
        "event_id": str(uuid.uuid4()),
        "student_id": event.student_id,
        "zone": event.zone,
        "event_type": event.event_type,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    try:
        producer.send(
            TOPIC_NAME,
            key=event.zone.encode("utf-8"),
            value=event_data
        ).get(timeout=15)

        return {
            "message": "Event sent to Kafka successfully",
            "event": event_data
        }

    except (KafkaError, Exception) as e:
        print(f"Kafka sending failed: {e}")
        raise HTTPException(
            status_code=503,
            detail="Unable to send event to Kafka."
        )
