
import random
import uuid
from datetime import datetime, timezone


def choose_zone():
    hour = datetime.now().hour

    if 8 <= hour < 11:
        zones = ["Library", "Canteen", "Lab"]
        weights = [4, 1, 3]
    elif 11 <= hour < 14:
        zones = ["Library", "Canteen", "Lab"]
        weights = [1, 7, 2]
    elif 14 <= hour < 18:
        zones = ["Library", "Canteen", "Lab"]
        weights = [5, 2, 3]
    else:
        zones = ["Library", "Canteen", "Lab"]
        weights = [6, 1, 3]

    return random.choices(zones, weights=weights, k=1)[0]


def generate_event(event_type=None, student_id=None):
    if event_type is None:
        event_type = random.choice(["check_in", "check_out"])

    if event_type not in ["check_in", "check_out"]:
        raise ValueError("Invalid event type")

    event = {
        "event_id": str(uuid.uuid4()),
        "student_id": student_id or f"S{random.randint(1, 500):04d}",
        "zone": choose_zone(),
        "event_type": event_type,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    return event


if __name__ == "__main__":
    while True:
        event = generate_event()
        print(event)
        import time
        time.sleep(2)
