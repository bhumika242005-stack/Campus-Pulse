import json
import time
import os
import socket

from kafka import KafkaProducer

from simulator import generate_event



KAFKA_SERVER = os.getenv("KAFKA_SERVER", "localhost:9092")
TOPIC_NAME = os.getenv("KAFKA_TOPIC", "campus-events")


generated_event_ids = set()

def send_event(producer, event):
    if event["event_id"] in generated_event_ids:
        print(f"Duplicate event ignored: {event['event_id']}")
        return

    generated_event_ids.add(event["event_id"])
    try:
        future = producer.send(
            TOPIC_NAME,
            value=event,
            key=event["zone"].encode("utf-8")
        )

        metadata = future.get(timeout=10)

        print(
            f"Sent | "
            f"event={event['event_id']} | "
            f"zone={event['zone']} | "
            f"partition={metadata.partition} | "
            f"offset={metadata.offset}"
        )

    except Exception as e:
        print(
            f"Failed | "
            f"event={event['event_id']} | "
            f"error={e}"
        )
def kafka_available():
    host, port = KAFKA_SERVER.split(":")
    
    try:
        with socket.create_connection((host, int(port)), timeout=3):
            return True
    except OSError:
        return False

def main():
    producer = None

    try:
        if not kafka_available():
            print(f"Kafka is not available at {KAFKA_SERVER}")
            return
        producer = KafkaProducer(
            bootstrap_servers=KAFKA_SERVER,
            value_serializer=lambda value: json.dumps(value).encode("utf-8"),
            request_timeout_ms=5000
        )

        print("Campus Pulse Producer Started")

        while True:
            event = generate_event()
            send_event(producer, event)
            time.sleep(2)

    except KeyboardInterrupt:
        print("\nProducer stopped.")

    except Exception as e:
        print(f"\nKafka connection failed: {e}")

    finally:
        if producer is not None:
            producer.flush()
            producer.close()


if __name__ == "__main__":
    main()