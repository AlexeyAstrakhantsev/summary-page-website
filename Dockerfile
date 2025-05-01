FROM python:3.11-slim

WORKDIR /app

# Копируем зависимости и устанавливаем их
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходники приложения
COPY . .

# Генерируем Prisma Client (если используется prisma)
# RUN prisma generate

# Запуск FastAPI через Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "4000"]

EXPOSE 4000

RUN apk add --no-cache tini openssl1.1 || apk add --no-cache tini openssl
ENTRYPOINT ["/sbin/tini", "--"]

# Запуск: backend и frontend параллельно
CMD ["sh", "-c", "node src/backend/server.js & npm start"]