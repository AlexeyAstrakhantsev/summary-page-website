# --- Base image ---
FROM node:20-alpine AS base
WORKDIR /app

# --- Install frontend dependencies ---
COPY package.json ./
RUN npm install

# --- Install backend dependencies ---
COPY package-backend.json ./
RUN npm install --prefix . --package=package-backend.json

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
COPY package-backend.json ./
RUN npm install --prefix . --package=package-backend.json --omit=dev

# Копируем собранный фронт и backend
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/next.config.js ./
COPY --from=base /app/styles ./styles
COPY --from=base /app/src ./src
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/.env .

# Генерируем Prisma Client (на всякий случай)
RUN npx prisma generate

# Открываем порты
EXPOSE 3000 4000

# Устанавливаем tini для управления процессами
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

# Запуск: backend и frontend параллельно
CMD ["sh", "-c", "node src/backend/server.js & npm start"]