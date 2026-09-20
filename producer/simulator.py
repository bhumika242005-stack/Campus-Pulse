import random
import time
import uuid
from datetime import datetime, timezone


ZONES = [
    "Library",
    "Canteen",
    "Lab"
]

EVENT_TYPE = "check_in"


def generate_event():
    event = {
        "event_id": str(uuid.uuid4()),
        "student_id": f"S{random.randint(1, 500):04d}",
        "zone": random.choice(ZONES),
        "event_type": EVENT_TYPE,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    return event


if __name__ == "__main__":

    while True:
        event = generate_event()

        print(event)

        time.sleep(2)