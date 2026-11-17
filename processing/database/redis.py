import redis


REDIS_HOST = "localhost"
REDIS_PORT = 6379


redis_client = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
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