# --- Base image ---
FROM node:20-alpine AS base
WORKDIR /app

# --- Install frontend dependencies ---
COPY package.json ./
RUN npm install

# --- Install backend dependencies ---

# --- Copy and build app ---
COPY . .
RUN npm run build

# --- Prisma generate & migrate ---
RUN npx prisma generate

# --- Production image ---
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Установим только runtime зависимости
COPY package.json ./
RUN npm install --omit=dev

# Копируем собранный фронт и backend
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/next.config.js ./
COPY --from=base /app/src ./src
COPY --from=base /app/prisma ./prisma

# Генерируем Prisma Client для production
RUN npx prisma generate

# Открываем порты
EXPOSE 3000 4000

# Устанавливаем tini для управления процессами
RUN apk add --no-cache tini openssl1.1 || apk add --no-cache tini openssl
ENTRYPOINT ["/sbin/tini", "--"]

# Запуск: backend и frontend параллельно
CMD ["sh", "-c", "node src/backend/server.js & npm start"]