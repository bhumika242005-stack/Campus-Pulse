
import requests
import uuid

API_URL = "http://127.0.0.1:8000/events"

zones = ["Library", "Canteen", "Lab"]
event_types = ["check_in", "check_out"]

successful = 0
failed = 0

print("Starting automated test: 10 events\n")

for i in range(1, 11):
    event = {
        "student_id": f"TEST{i:04d}",
        "zone": zones[(i - 1) % len(zones)],
        "event_type": event_types[(i - 1) % len(event_types)]
    }

    try:
        response = requests.post(
            API_URL,
            json=event,
            timeout=20
        )

        if response.status_code == 200:
            successful += 1
            print(f"SUCCESS | Event {i} | {event['student_id']} | "
                  f"{event['zone']} | {event['event_type']}")
        else:
            failed += 1
            print(f"FAILED | Event {i} | HTTP {response.status_code}")
            print(response.text)

    except requests.RequestException as error:
        failed += 1
        print(f"ERROR | Event {i} | {error}")

print("\n---------- TEST SUMMARY ----------")
print(f"Total events: 10")
print(f"Successful: {successful}")
print(f"Failed: {failed}")
print("----------------------------------")
