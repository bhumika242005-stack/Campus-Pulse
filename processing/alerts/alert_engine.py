from datetime import datetime

# Configurable demo threshold
ALERT_THRESHOLD = 100


def check_zone_activity(zone, count):
    """
    Generate an alert when activity in a zone
    reaches the configured threshold.
    """

    if count >= ALERT_THRESHOLD:
        return {
            "alert_type": "HIGH_ACTIVITY",
            "zone": zone,
            "count": count,
            "severity": "HIGH",
            "message": f"High activity detected in {zone}: {count} events",
            "timestamp": datetime.now().isoformat()
        }

    return None