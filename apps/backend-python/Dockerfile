FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

COPY services/autonomous-browser/apps/backend-python/pyproject.toml /app/
# Instala poetry lightweight
RUN pip install --no-cache-dir poetry && poetry config virtualenvs.create false
RUN poetry install --no-interaction --no-ansi

COPY services/autonomous-browser/apps/backend-python /app

CMD ["python", "-m", "src.main"]
