# --- Base image ---
FROM node:20-alpine AS base
WORKDIR /app

# 1. Копируем только package.json и lock для кэширования зависимостей
COPY package.json package-lock.json* ./
RUN npm install

# 2. Копируем исходники и конфиги (всё, что нужно для билда)
COPY next.config.js ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY tsconfig.json ./
COPY public ./public
COPY src ./src
COPY components ./components
COPY lib ./lib
COPY hooks ./hooks
COPY styles ./styles
COPY prisma ./prisma

# 3. Сборка фронта и backend
RUN npm run build

# 4. Генерируем Prisma Client
RUN npx prisma generate

# --- Production image ---
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Установим только runtime зависимости
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Копируем собранный фронт и backend
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/next.config.js ./
COPY --from=base /app/src ./src
COPY --from=base /app/prisma ./prisma

# Генерируем Prisma Client для production
RUN npx prisma generate

EXPOSE 3000 4000

RUN apk add --no-cache tini openssl1.1 || apk add --no-cache tini openssl
ENTRYPOINT ["/sbin/tini", "--"]

# Запуск: backend и frontend параллельно
CMD ["sh", "-c", "node src/backend/server.js & npm start"]