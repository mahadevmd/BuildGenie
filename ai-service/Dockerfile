FROM python:3.13-slim
WORKDIR /app

# Install system deps if needed (psycopg requires libpq)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy service code and model
COPY . /app

ENV PORT=5001 \
    BUILDGENIE_MODEL_PATH=buildgenie_pipeline.joblib

EXPOSE 5001
CMD ["python", "forecast_api.py"]