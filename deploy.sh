#!/bin/bash
set -e

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для вывода с форматированием
log() {
  echo -e "${GREEN}[DEPLOY]${NC} $1"
}

warn() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

log "Начинаем процесс деплоя Next.js приложения в Docker..."

# Проверка наличия docker и docker-compose
if ! command -v docker &> /dev/null; then
    log "Docker не установлен. Устанавливаем..."
    sudo apt update
    sudo apt install -y docker.io
    sudo systemctl enable docker
    sudo systemctl start docker
    sudo usermod -aG docker $USER
    log "Docker установлен. Рекомендуется перелогиниться для применения изменений групп."
fi

if ! command -v docker-compose &> /dev/null; then
    log "Docker Compose не установлен. Устанавливаем..."
    sudo apt install -y docker-compose
    log "Docker Compose установлен."
fi

# Проверка наличия .env файла
if [ ! -f .env ]; then
    warn "Файл .env не найден. Создаем с пустым значением OPENROUTER_API_KEY."
    echo "OPENROUTER_API_KEY=" > .env
    warn "Не забудьте указать ваш OPENROUTER_API_KEY в файле .env!"
fi

# Сборка и запуск контейнера
log "Собираем и запускаем Docker-контейнер..."
docker-compose down || true
docker-compose up -d --build

# Проверка статуса
sleep 5
if docker-compose ps | grep -q "Up"; then
    log "Приложение успешно запущено!"
    log "Доступно по адресу: http://localhost:3000"
else
    warn "Возникла проблема при запуске контейнера. Проверьте логи:"
    docker-compose logs
fi

log "Процесс деплоя завершен." 