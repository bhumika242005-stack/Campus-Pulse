from datetime import datetime

# Alert when actual occupancy reaches this number
ALERT_THRESHOLD = 100


def check_zone_activity(zone, occupancy):

    if occupancy >= ALERT_THRESHOLD:
        return {
            "alert_type": "HIGH_OCCUPANCY",
            "zone": zone,
            "count": occupancy,
            "severity": "HIGH",
            "message": f"High occupancy detected in {zone}: {occupancy} students",
            "timestamp": datetime.now().isoformat()
        }

    return None