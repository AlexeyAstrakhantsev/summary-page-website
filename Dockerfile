FROM python:3.11-slim

WORKDIR /app

# Копируем зависимости и устанавливаем их
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходники приложения
COPY . .

# Генерация Prisma Client для Python (после копирования schema.prisma)
RUN python -m prisma generate

# Запуск FastAPI через Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "4000"]

EXPOSE 4000