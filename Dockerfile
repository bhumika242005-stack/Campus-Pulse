
FROM python:3.11-slim

WORKDIR /app

COPY processing/requirements.txt ./requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY processing/ ./processing/

CMD ["python", "-m", "processing.aggregation.aggregator"]
