FROM node:18-alpine AS base

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем зависимости
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Собираем приложение
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Запускаем приложение
FROM base AS runner
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Добавляем пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]