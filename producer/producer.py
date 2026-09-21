import json
import time
import os

from kafka import KafkaProducer

from simulator import generate_event



KAFKA_SERVER = os.getenv("KAFKA_SERVER", "localhost:9092")
TOPIC_NAME = os.getenv("KAFKA_TOPIC", "campus-events")




def send_event(producer, event):
    producer.send(
        TOPIC_NAME,
        value=event,
        key=event["zone"].encode("utf-8")
    )

    print(
        f"Sent | "
        f"event={event['event_id']} | "
        f"zone={event['zone']}"
    )


def main():
    producer = KafkaProducer(
        bootstrap_servers=KAFKA_SERVER,
        value_serializer=lambda value: json.dumps(value).encode("utf-8")
    )

    print("Campus Pulse Producer Started")

    try:
        while True:
            event = generate_event()

            send_event(producer, event)

            time.sleep(2)

    except KeyboardInterrupt:
        print("\nProducer stopped.")

    finally:
        producer.flush()
        producer.close()


if __name__ == "__main__":
    main()