
FROM python:3.9-slim


WORKDIR /app


COPY requirements.txt .
COPY web_server.py .
COPY templates/ ./templates
COPY static/ ./static


RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "web_server.py"]
