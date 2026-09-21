import json

from kafka import KafkaConsumer

from processing.schema.event_schema import validate_event


KAFKA_SERVER = "localhost:9092"
TOPIC_NAME = "campus-events"


consumer = KafkaConsumer(
    TOPIC_NAME,
    bootstrap_servers=KAFKA_SERVER,
    auto_offset_reset="earliest",
    enable_auto_commit=True,
    group_id="campus-pulse-processing",
    value_deserializer=lambda value: json.loads(
        value.decode("utf-8")
    )
)


print("Campus Pulse Consumer Started")
print(f"Listening to topic: {TOPIC_NAME}")


try:
    for message in consumer:

        event = message.value

        # Validate event
        is_valid, message_text = validate_event(event)

        if not is_valid:
            print(f"\n❌ Invalid event: {message_text}")
            print(json.dumps(event, indent=2))
            continue

        # Valid event
        print("\n✅ Valid event received:")
        print(json.dumps(event, indent=2))

        print(f"Event ID: {event['event_id']}")
        print(f"Student: {event['student_id']}")
        print(f"Zone: {event['zone']}")
        print(f"Event Type: {event['event_type']}")
        print(f"Timestamp: {event['timestamp']}")


except KeyboardInterrupt:
    print("\nConsumer stopped.")


finally:
    consumer.close()