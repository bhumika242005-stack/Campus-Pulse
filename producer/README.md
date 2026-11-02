# Campus Pulse – Event Producer

This module is responsible for generating campus activity events, receiving event requests through FastAPI, and publishing events to an Apache Kafka topic.

## Files

- `simulator.py` – Generates realistic simulated campus events.
- `producer.py` – Sends simulated events to Kafka.
- `api.py` – Receives events through a REST API and publishes them to Kafka.
- `requirements.txt` – Python dependency list.

## Technologies Used

- Python
- Apache Kafka
- Docker
- FastAPI
- Uvicorn
- Kafka-Python

## Event Format

Each event contains five fields:

- `event_id` – Unique UUID for the event.
- `student_id` – Student identifier.
- `zone` – Library, Canteen, or Lab.
- `event_type` – check_in or check_out.
- `timestamp` – UTC timestamp in ISO format.

Example:

```json
{
  "event_id": "70d7bcbd-ec81-4ea4-9eb6-da5fcc74b97f",
  "student_id": "S0369",
  "zone": "Library",
  "event_type": "check_in",
  "timestamp": "2026-09-21T10:50:58.123456+00:00"
}
```

## Realistic Activity Simulation

The simulator uses different zone probabilities based on the time of day:

- Morning: Higher Library and Lab activity.
- Lunch: Higher Canteen activity.
- Afternoon: Higher Library and Lab activity.
- Evening/night: Higher Library activity.

This makes generated events more realistic than completely uniform random events.

## Kafka Configuration

- Kafka broker: `localhost:9092`
- Kafka topic: `campus-events`

The producer uses the event's zone as the Kafka message key.

```python
key=event["zone"].encode("utf-8")
```

The API also uses the zone as its message key.

## Serialization

Events are converted from Python dictionaries to JSON and encoded as UTF-8 before being sent to Kafka.

```python
value_serializer=lambda value: json.dumps(value).encode("utf-8")
```

## FastAPI Integration

The FastAPI application provides a REST endpoint for receiving campus activity events.

**Endpoint:**

`POST /events`

**Request body:**

```json
{
  "student_id": "S0001",
  "zone": "Library",
  "event_type": "check_in"
}
```

The API generates the event ID and UTC timestamp before publishing the complete event to Kafka.

Interactive API documentation is available at:

`http://127.0.0.1:8000/docs`

## Input Validation

The API validates incoming event data.

- Allowed zones: Library, Canteen, Lab.
- Allowed event types: check_in, check_out.
- Invalid zones return HTTP 400.
- Invalid event types return HTTP 400.
- Missing or incorrectly formatted required fields are rejected by Pydantic validation.

## Kafka Producer Acknowledgement

The API waits for Kafka to confirm the send operation using:

```python
producer.send(
    TOPIC_NAME,
    key=event["zone"].encode("utf-8"),
    value=event_data
).get(timeout=15)
```

A successful response confirms that Kafka acknowledged the message.

## Error Handling and Recovery

The FastAPI producer includes connection and error-handling mechanisms.

- Attempts to establish a Kafka connection up to five times during startup.
- Waits three seconds between connection attempts.
- Uses Kafka producer retries for message delivery.
- Returns HTTP 503 when Kafka is unavailable.
- Attempts to reconnect when a new event arrives and the producer is unavailable.
- Closes the producer safely during application shutdown.

## Testing Performed

The following tests were performed:

1. Successfully sent multiple campus activity events through FastAPI.
2. Verified events for different student IDs and campus zones.
3. Tested invalid campus zones.
4. Tested invalid event types.
5. Verified published messages using the Kafka console consumer.
6. Stopped Kafka and tested API behavior during broker unavailability.
7. Verified connection retry attempts.
8. Restarted Kafka and successfully sent a new event after recovery.

## Running the Application

### 1. Start Docker and Kafka

From the project root:

```bash
docker compose up -d
```

### 2. Activate the Python virtual environment

From the `producer` directory:

```bash
.venv\Scripts\activate.bat
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Start FastAPI

```bash
python -m uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Open API documentation

Visit:

`http://127.0.0.1:8000/docs`

Use the `POST /events` endpoint to send campus activity events.

### 6. View Kafka events

Open another terminal and run:

```bash
docker exec -it campus-kafka /opt/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic campus-events --from-beginning
```

The consumer displays the JSON messages stored in the Kafka topic.

## Producer Flow

```text
Campus Activity Simulator / API Request
                  |
                  v
          Python Event Data
                  |
                  v
          JSON Serialization
                  |
                  v
           Kafka Producer
                  |
                  v
          campus-events Topic
                  |
                  v
           Kafka Partitions
                  |
                  v
          Backend Consumer
```

## Member 2 Responsibility

Member 2 is responsible for Python-based campus event generation, Kafka producer implementation, FastAPI event integration, event validation, message publishing, and producer-side error handling and testing.