import psycopg2

DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "database": "campus_pulse",
    "user": "campus",
    "password": "campus123"
}


def get_connection():
    return psycopg2.connect(**DB_CONFIG)


def create_table():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY,
            event_id VARCHAR(100) UNIQUE NOT NULL,
            student_id VARCHAR(20) NOT NULL,
            zone VARCHAR(50) NOT NULL,
            event_type VARCHAR(50) NOT NULL,
            timestamp TIMESTAMP NOT NULL
        )
    """)

    connection.commit()
    cursor.close()
    connection.close()

    print("PostgreSQL table ready!")


def save_event(event):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO events
        (event_id, student_id, zone, event_type, timestamp)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (event_id) DO NOTHING
    """, (
        event["event_id"],
        event["student_id"],
        event["zone"],
        event["event_type"],
        event["timestamp"]
    ))

    connection.commit()
    cursor.close()
    connection.close()

    print(f"Event saved to PostgreSQL: {event['event_id']}")