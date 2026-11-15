import json
from datetime import datetime

from kafka import KafkaConsumer

from processing.schema.event_schema import validate_event
from processing.database.postgres import process_event, create_table
from processing.database.redis import set_value
from processing.alerts.alert_engine import check_zone_activity


KAFKA_SERVER = "localhost:9092"
TOPIC_NAME = "campus-events"

consumer = KafkaConsumer(
    TOPIC_NAME,
    bootstrap_servers=KAFKA_SERVER,
    auto_offset_reset="earliest",
    enable_auto_commit=True,
    group_id="campus-pulse-aggregator-v5",
    value_deserializer=lambda value: json.loads(
        value.decode("utf-8")
    )
)

create_table()

print("Campus Pulse Aggregator Started")
print(f"Listening to topic: {TOPIC_NAME}")


try:
    for message in consumer:

        event = message.value

        is_valid, message_text = validate_event(event)

        if not is_valid:
            print(f"Invalid event: {message_text}")
            continue

        try:
            inserted, zone_counts = process_event(event)

            if not inserted:
                print(f"Duplicate event ignored: {event['event_id']}")
                continue

            for zone in ["Library", "Canteen", "Lab"]:
                count = zone_counts.get(zone, 0)

                set_value(f"zone:{zone}", count)

                alert = check_zone_activity(zone, count)

                processed_data = {
                    "zone": zone,
                    "occupancy": count,
                    "alert": alert,
                    "updated_at": datetime.now().isoformat()
                }

                set_value(
                    f"processed:{zone}",
                    json.dumps(processed_data)
                )

                if alert:
                    set_value(
                        f"alert:{zone}",
                        json.dumps(alert)
                    )

            print("\nEVENT PROCESSED")
            print(f"Student: {event['student_id']}")
            print(f"Zone: {event['zone']}")
            print(f"Event: {event['event_type']}")
            print(f"New occupancy: {zone_counts.get(event['zone'], 0)}")

        except Exception as error:
            print(f"Processing failed: {error}")


except KeyboardInterrupt:
    print("\nAggregator stopped.")

finally:
    consumer.close()