import random
import time
import uuid
from datetime import datetime, timezone


EVENT_TYPE = "check_in"


def choose_zone():
    hour = datetime.now().hour

    if 8 <= hour < 11:
        # Morning
        zones = ["Library", "Canteen", "Lab"]
        weights = [4, 1, 3]

    elif 11 <= hour < 14:
        # Lunch
        zones = ["Library", "Canteen", "Lab"]
        weights = [1, 7, 2]

    elif 14 <= hour < 18:
        # Afternoon
        zones = ["Library", "Canteen", "Lab"]
        weights = [5, 2, 3]

    else:
        # Evening / night
        zones = ["Library", "Canteen", "Lab"]
        weights = [6, 1, 3]

    return random.choices(zones, weights=weights, k=1)[0]


def generate_event():
    event = {
        "event_id": str(uuid.uuid4()),
        "student_id": f"S{random.randint(1, 500):04d}",
        "zone": choose_zone(),
        "event_type": EVENT_TYPE,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    return event


if __name__ == "__main__":

    while True:
        event = generate_event()

        print(event)

        time.sleep(2)