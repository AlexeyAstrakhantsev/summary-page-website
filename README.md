# AI Page Summarizer - Cайт расширения Chrome

Веб-сайт для Chrome-расширения AI Page Summarizer, которое создает краткие содержания веб-страниц с использованием AI (OpenRouter API).

## Технологии

- **Next.js 14+** - React-фреймворк
- **Tailwind CSS** - Утилитарный CSS-фреймворк
- **Docker** - Контейнеризация приложения
- **TypeScript** - Типизированный JavaScript

## Требования

- Node.js 18+ (для локальной разработки)
- Docker и Docker Compose (для запуска в контейнере)

## Установка и запуск

### Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
```

### Запуск в Docker-контейнере

```bash
# Копирование файла с переменными окружения
cp .env.example .env

# Редактирование .env файла (при необходимости)
nano .env  # или любой другой редактор

# Запуск контейнера
./deploy.sh  # или вручную: docker-compose up -d --build
```

## Структура проекта

- `app/` - Основные компоненты страниц (Next.js App Router)
- `components/` - Переиспользуемые компоненты UI
- `lib/` - Утилиты и вспомогательные функции
- `public/` - Статические файлы

## Деплой на хостинг

1. Клонируйте репозиторий на ваш сервер
2. Настройте переменные окружения в `.env` файле
3. Запустите скрипт деплоя: `./deploy.sh`
4. Настройте Nginx для проксирования запросов (при необходимости)

## Конфигурация Nginx

Пример конфигурации Nginx для проксирования запросов к контейнеру:

```nginx
server {
    listen 80;
    server_name ваш-домен.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## SSL (HTTPS)

Рекомендуется настроить SSL-сертификат с помощью Certbot:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ваш-домен.com
```

## Лицензия

MIT 