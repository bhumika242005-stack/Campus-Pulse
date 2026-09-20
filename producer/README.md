# Campus Pulse - Event Producer

This module simulates campus activity and sends events to Kafka.

## Files

- `simulator.py` - Generates simulated campus events.
- `producer.py` - Sends events to the Kafka topic.
- `requirements.txt` - Python dependencies.

## Event Format

Each event contains:

- `event_id` - Unique event ID
- `student_id` - Simulated student ID
- `zone` - Library, Canteen, or Lab
- `event_type` - Currently `check_in`
- `timestamp` - UTC timestamp

Example:

```json
{
  "event_id": "E000001",
  "student_id": "S0102",
  "zone": "Library",
  "event_type": "check_in",
  "timestamp": "2026-09-20T14:30:15Z"
}