from datetime import datetime


VALID_ZONES = {
    "Library",
    "Canteen",
    "Lab"
}

VALID_EVENT_TYPES = {
    "check_in",
    "check_out"
}


REQUIRED_FIELDS = {
    "event_id",
    "student_id",
    "zone",
    "event_type",
    "timestamp"
}


def validate_event(event):
    """
    Validate a Campus Pulse Kafka event.

    Returns:
        (True, "Valid event") if the event is valid.
        (False, "Reason") if the event is invalid.
    """

    # 1. Check that the event is a dictionary
    if not isinstance(event, dict):
        return False, "Event is not a JSON object"

    # 2. Check required fields
    missing_fields = REQUIRED_FIELDS - event.keys()

    if missing_fields:
        return False, f"Missing fields: {sorted(missing_fields)}"

    # 3. Validate event_id
    if not isinstance(event["event_id"], str) or not event["event_id"]:
        return False, "Invalid event_id"

    # 4. Validate student_id
    if not isinstance(event["student_id"], str) or not event["student_id"]:
        return False, "Invalid student_id"

    # 5. Validate zone
    if event["zone"] not in VALID_ZONES:
        return False, f"Invalid zone: {event['zone']}"

    # 6. Validate event type
    if event["event_type"] not in VALID_EVENT_TYPES:
        return False, f"Invalid event_type: {event['event_type']}"

    # 7. Validate timestamp
    try:
        datetime.fromisoformat(
            event["timestamp"].replace("Z", "+00:00")
        )
    except (ValueError, TypeError):
        return False, "Invalid timestamp"

    return True, "Valid event"