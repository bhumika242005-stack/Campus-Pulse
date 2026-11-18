
import os
import redis

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD") or None
REDIS_URL = os.getenv("REDIS_URL")

if REDIS_URL:
    redis_client = redis.Redis.from_url(
        REDIS_URL,
        decode_responses=True
    )
else:
    redis_client = redis.Redis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        password=REDIS_PASSWORD,
        decode_responses=True
    )


def test_connection():
    try:
        redis_client.ping()
        print("Redis connection successful!")
        return True
    except redis.RedisError as e:
        print(f"Redis connection failed: {e}")
        return False


def set_value(key, value):
    redis_client.set(key, value)


def get_value(key):
    return redis_client.get(key)
