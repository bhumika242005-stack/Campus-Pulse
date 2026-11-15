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


def test_connection():
    try:
        connection = get_connection()
        connection.close()
        print("PostgreSQL connection successful!")
        return True
    except Exception as e:
        print(f"PostgreSQL connection failed: {e}")
        return False


def create_table():
    connection = get_connection()

    try:
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

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS student_presence (
                student_id VARCHAR(20) PRIMARY KEY,
                zone VARCHAR(50) NOT NULL,
                check_in_time TIMESTAMP NOT NULL
            )
        """)

        connection.commit()
        cursor.close()

        print("PostgreSQL tables ready!")

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()


def process_event(event):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO events
            (event_id, student_id, zone, event_type, timestamp)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (event_id) DO NOTHING
            RETURNING event_id
        """, (
            event["event_id"],
            event["student_id"],
            event["zone"],
            event["event_type"],
            event["timestamp"]
        ))

        inserted = cursor.fetchone()

        if inserted:
            if event["event_type"] == "check_in":
                cursor.execute("""
                    INSERT INTO student_presence
                    (student_id, zone, check_in_time)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (student_id)
                    DO UPDATE SET
                        zone = EXCLUDED.zone,
                        check_in_time = EXCLUDED.check_in_time
                """, (
                    event["student_id"],
                    event["zone"],
                    event["timestamp"]
                ))

            elif event["event_type"] == "check_out":
                cursor.execute("""
                    DELETE FROM student_presence
                    WHERE student_id = %s AND zone = %s
                """, (
                    event["student_id"],
                    event["zone"]
                ))

        cursor.execute("""
            SELECT zone, COUNT(*)
            FROM student_presence
            GROUP BY zone
        """)

        counts = dict(cursor.fetchall())

        connection.commit()

        return bool(inserted), counts

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()