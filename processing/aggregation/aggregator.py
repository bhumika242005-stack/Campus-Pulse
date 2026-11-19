from dotenv import load_dotenv
load_dotenv()

import os
import json
from datetime import datetime

from kafka import KafkaConsumer

from processing.schema.event_schema import validate_event
from processing.database.postgres import create_table, process_event
from processing.database.redis import set_value, test_connection
from processing.alerts.alert_engine import check_zone_activity


# Kafka configuration
KAFKA_SERVER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
TOPIC_NAME = os.getenv("KAFKA_TOPIC", "campus-events")
KAFKA_GROUP_ID = os.getenv(
    "KAFKA_GROUP_ID",
    "campus-pulse-aggregator-v4"
)

KAFKA_SECURITY_PROTOCOL = os.getenv(
    "KAFKA_SECURITY_PROTOCOL", "PLAINTEXT"
)
KAFKA_SASL_MECHANISM = os.getenv("KAFKA_SASL_MECHANISM")
KAFKA_USERNAME = os.getenv("KAFKA_USERNAME")
KAFKA_PASSWORD = os.getenv("KAFKA_PASSWORD")
KAFKA_SSL_CAFILE = os.getenv("KAFKA_SSL_CAFILE") or None

# Valid zones
ZONES = ["Library", "Canteen", "Lab"]


# Create PostgreSQL tables
create_table()

# Test Redis connection
if not test_connection():
    raise RuntimeError("Redis connection failed")


# Kafka consumer
KAFKA_CONFIG = {
    "bootstrap_servers": KAFKA_SERVER,
    "auto_offset_reset": "earliest",
    "enable_auto_commit": False,
    "api_version": (2, 8, 0),
    "group_id": KAFKA_GROUP_ID
    
}

if KAFKA_SECURITY_PROTOCOL != "PLAINTEXT":
    KAFKA_CONFIG.update({
        "security_protocol": KAFKA_SECURITY_PROTOCOL,
        "sasl_mechanism": KAFKA_SASL_MECHANISM,
        "sasl_plain_username": KAFKA_USERNAME,
        "sasl_plain_password": KAFKA_PASSWORD,
        "ssl_cafile": KAFKA_SSL_CAFILE
    })

consumer = KafkaConsumer(TOPIC_NAME, **KAFKA_CONFIG)


print("\nCampus Pulse Aggregator Started")
print(f"Listening to topic: {TOPIC_NAME}")


try:

    for message in consumer:

        # 1. Decode Kafka message safely
        try:
            event = json.loads(message.value.decode("utf-8"))

        except (json.JSONDecodeError, UnicodeDecodeError, AttributeError) as e:
            print(f"\nInvalid Kafka message skipped: {e}")
            consumer.commit()
            continue

        # 2. Validate event
        is_valid, message_text = validate_event(event)

        if not is_valid:
            print(f"\nInvalid event: {message_text}")
            consumer.commit()
            continue

        # 3. Extract event information
        event_id = event["event_id"]
        student_id = event["student_id"]
        zone = event["zone"]
        event_type = event["event_type"]

        # 4. Save event and update current occupancy
        inserted, zone_counts = process_event(event)

        if not inserted:
            print(f"\nDuplicate event ignored: {event_id}")
            consumer.commit()
            continue

        # 5. Update Redis occupancy for every zone
        for zone_name in ZONES:

            occupancy = zone_counts.get(zone_name, 0)

            set_value(
                f"zone:{zone_name}",
                occupancy
            )

            # 6. Check for high occupancy alerts
            alert = check_zone_activity(
                zone_name,
                occupancy
            )

            if alert:

                print("\n🚨 ALERT GENERATED")
                print(json.dumps(alert, indent=2))

                set_value(
                    f"alert:{zone_name}",
                    json.dumps(alert)
                )

            # 7. Store processed data for dashboard
            processed_data = {
                "zone": zone_name,
                "occupancy": occupancy,
                "alert": alert,
                "updated_at": datetime.now().isoformat()
            }

            set_value(
                f"processed:{zone_name}",
                json.dumps(processed_data)
            )

        # 8. Display processing result
        print("\n" + "=" * 45)
        print("EVENT PROCESSED")
        print("=" * 45)

        print(f"Event ID   : {event_id}")
        print(f"Student    : {student_id}")
        print(f"Zone       : {zone}")
        print(f"Event Type : {event_type}")

        print("\nCurrent Occupancy:")

        for zone_name in ZONES:
            print(
                f"  {zone_name}: "
                f"{zone_counts.get(zone_name, 0)}"
            )

        print("=" * 45)

        # 9. Commit Kafka offset after successful processing
        consumer.commit()


except KeyboardInterrupt:

    print("\nAggregator stopped.")


finally:

    consumer.close()
    print("Kafka consumer closed.")