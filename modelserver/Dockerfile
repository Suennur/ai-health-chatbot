
FROM python:3.9-slim


WORKDIR /app


COPY requirements.txt .
COPY model_server.py .
COPY model ./model  
COPY test.py .

RUN pip install --no-cache-dir -r requirements.txt


CMD ["python", "model_server.py"]
