import json
from collections import defaultdict
from datetime import datetime

from kafka import KafkaConsumer

from processing.schema.event_schema import validate_event
from processing.database.redis import set_value
from processing.database.postgres import save_event
from processing.alerts.alert_engine import check_zone_activity


KAFKA_SERVER = "localhost:9092"
TOPIC_NAME = "campus-events"

# Aggregated statistics
zone_counts = defaultdict(int)
student_counts = defaultdict(int)
event_type_counts = defaultdict(int)


consumer = KafkaConsumer(
    TOPIC_NAME,
    bootstrap_servers=KAFKA_SERVER,
    auto_offset_reset="earliest",
    enable_auto_commit=True,
    group_id="campus-pulse-aggregator-v4",
    value_deserializer=lambda value: json.loads(
        value.decode("utf-8")
    )
)


print("Campus Pulse Aggregator Started")
print(f"Listening to topic: {TOPIC_NAME}")


try:
    for message in consumer:

        event = message.value

        # 1. Validate event
        is_valid, message_text = validate_event(event)

        if not is_valid:
            print(f"\n❌ Invalid event: {message_text}")
            continue

        # 2. Extract fields
        zone = event["zone"]
        student_id = event["student_id"]
        event_type = event["event_type"]

        # 3. Store raw event in PostgreSQL
        save_event(event)

        # 4. Update in-memory aggregation
        zone_counts[zone] += 1
        student_counts[student_id] += 1
        event_type_counts[event_type] += 1

        current_zone_count = zone_counts[zone]

        # 5. Store counters in Redis
        set_value(
            f"zone:{zone}",
            current_zone_count
        )

        set_value(
            f"event_type:{event_type}",
            event_type_counts[event_type]
        )

        # 6. Generate alert
        alert = check_zone_activity(
            zone,
            current_zone_count
        )

        if alert:
            print("\n🚨 ALERT GENERATED")
            print(json.dumps(alert, indent=2))

            set_value(
                f"alert:{zone}",
                json.dumps(alert)
            )

        # 7. Backend-ready processed data
        processed_data = {
            "zone": zone,
            "activity_count": current_zone_count,
            "alert": alert,
            "updated_at": datetime.now().isoformat()
        }

        set_value(
            f"processed:{zone}",
            json.dumps(processed_data)
        )

        # 8. Display processing result
        print("\n" + "=" * 50)
        print("EVENT PROCESSED")
        print("=" * 50)

        print(f"Event ID     : {event['event_id']}")
        print(f"Student      : {student_id}")
        print(f"Zone         : {zone}")
        print(f"Event Type   : {event_type}")
        print(f"Zone Activity: {current_zone_count}")

        print("\nZone Counts:")
        for zone_name, count in zone_counts.items():
            print(f"  {zone_name}: {count}")

        print("\nEvent Type Counts:")
        for event_name, count in event_type_counts.items():
            print(f"  {event_name}: {count}")

        print("=" * 50)

except KeyboardInterrupt:
    print("\nAggregator stopped.")

finally:
    consumer.close()