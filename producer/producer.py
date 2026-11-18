
import json
import time
import os
from dotenv import load_dotenv
from confluent_kafka import Producer
from simulator import generate_event
load_dotenv()


KAFKA_SERVER = os.getenv(
    "KAFKA_BOOTSTRAP_SERVERS",
    os.getenv(
        "KAFKA_SERVER",
        "campus-pulse-kafka-campus-pulse-team.f.aivencloud.com:23481"
    )
)

TOPIC_NAME = os.getenv("KAFKA_TOPIC", "campus-events")
KAFKA_USERNAME = os.getenv("KAFKA_USERNAME", "avnadmin")
KAFKA_PASSWORD = os.getenv("KAFKA_PASSWORD")

CA_CERT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ca.pem")

generated_event_ids = set()


def delivery_report(err, msg, event_id):
    if err is not None:
        print(f"Failed | event={event_id} | error={err}")
    else:
        generated_event_ids.add(event_id)
        print(
            f"Sent | event={event_id} | "
            f"topic={msg.topic()} | "
            f"zone={msg.key().decode('utf-8')} | "
            f"partition={msg.partition()} | "
            f"offset={msg.offset()}"
        )


def send_event(producer, event):
    event_id = event["event_id"]

    if event_id in generated_event_ids:
        print(f"Duplicate event ignored: {event_id}")
        return

    try:
        producer.produce(
            TOPIC_NAME,
            key=event["zone"].encode("utf-8"),
            value=json.dumps(event).encode("utf-8"),
            callback=lambda err, msg: delivery_report(
                err, msg, event_id
            )
        )

        producer.poll(0)
        remaining = producer.flush(10)

        if remaining:
            print(f"Delivery timed out for event: {event_id}")

    except Exception as e:
        print(f"Failed | event={event_id} | error={e}")


def main():
    producer = None

    try:
        if not KAFKA_PASSWORD:
            raise ValueError("KAFKA_PASSWORD environment variable is missing")

        if not os.path.isfile(CA_CERT):
            raise FileNotFoundError(f"CA certificate not found: {CA_CERT}")

        config = {
            "bootstrap.servers": KAFKA_SERVER,
            "security.protocol": "SASL_SSL",
            "sasl.mechanisms": "SCRAM-SHA-256",
            "sasl.username": KAFKA_USERNAME,
            "sasl.password": KAFKA_PASSWORD,
            "ssl.ca.location": CA_CERT,
        }

        producer = Producer(config)

        print("Campus Pulse Producer Started")
        print(f"Connected to Aiven Kafka: {KAFKA_SERVER}")
        print(f"Publishing to topic: {TOPIC_NAME}")

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
            remaining = producer.flush(10)
            if remaining:
                print(f"Warning: {remaining} messages were not delivered.")


if __name__ == "__main__":
    main()
