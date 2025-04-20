const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const { generateSummary } = require('./openrouter');

// Настройки базы и порта (SQLite файл и порт сервера)
const DATABASE_URL = process.env.DATABASE_URL;
const PORT = 4000;

const prisma = new PrismaClient({
  datasources: {
    db: { url: DATABASE_URL }
  }
});
const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/ping', (req, res) => {
  console.log('[PING] Health check requested');
  res.json({ status: 'ok' });
});

// Google OAuth access_token verification (userinfo endpoint)
async function verifyGoogleToken(accessToken) {
  const url = `https://www.googleapis.com/oauth2/v3/userinfo`;
  console.log(`[OAUTH] Verifying Google access_token: ${accessToken && accessToken.slice(0, 10)}...`);
  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!data.sub) throw new Error('Invalid Google access_token');
  console.log(`[OAUTH] Access token valid for sub: ${data.sub}, email: ${data.email}`);
  return data;
} 

// POST /api/verify
app.post('/api/verify', async (req, res) => {
  console.log('[VERIFY] /api/verify called', req.body);
  try {
    const { token } = req.body;
    const info = await verifyGoogleToken(token);
    // Upsert user
    console.log(`[VERIFY] Upserting user: ${info.sub}, email: ${info.email}`);
    const user = await prisma.user.upsert({
      where: { id: info.sub },
      update: { lastLogin: new Date() },
      create: {
        id: info.sub,
        email: info.email,
        name: info.name,
        createdAt: new Date(),
        lastLogin: new Date(),
      },
    });
    console.log(`[VERIFY] User upserted:`, user);
    res.json({ userId: user.id, email: user.email, name: user.name });
  } catch (e) {
    console.error('[VERIFY] Error:', e);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// --- Лимиты ---
const UNAUTH_LIMIT = Number(process.env.UNAUTH_LIMIT) || 3;
const AUTH_LIMIT = Number(process.env.AUTH_LIMIT) || 10;
const PREMIUM_LIMIT = process.env.PREMIUM_LIMIT === undefined || process.env.PREMIUM_LIMIT === 'null' ? null : Number(process.env.PREMIUM_LIMIT); // null = безлимит

// POST /api/generate-summary
// Принимает: text, model, detailLevel, token/userId
app.post('/api/generate-summary', async (req, res) => {
  // Логируем что пришло от фронта (text, model, detailLevel, token/userId)
  const { text, model, detailLevel, token, userId } = req.body;
  console.log('[SUMMARY][IN] text:', text ? text.slice(0, 500) + (text.length > 500 ? '... [truncated]' : '') : '[empty]');
  console.log('[SUMMARY][IN] model:', model, 'detailLevel:', detailLevel, 'token:', token ? '[provided]' : '[none]', 'userId:', userId);

  try {
    let userId, isAuthorized = false, isPremium = false, email = null;
    let info = null;
    // 1. Определяем userId и статус
    if (req.body.token) {
      info = await verifyGoogleToken(req.body.token);
      userId = info.sub;
      isAuthorized = true;
      email = info.email;
    } else if (req.body.userId) {
      userId = req.body.userId; // Для неавторизованных userId должен приходить с клиента
      isAuthorized = false;
      email = null;
    } else {
      return res.status(400).json({ error: 'No user identification provided' });
    }

    // 2. Upsert user (только если авторизован)
    let user = null;
    if (isAuthorized) {
      console.log(`[SUMMARY] Upserting user: ${userId}, email: ${email}`);
      user = await prisma.user.upsert({
        where: { id: userId },
        update: { lastLogin: new Date() },
        create: {
          id: userId,
          email: info.email,
          name: info.name,
          createdAt: new Date(),
          lastLogin: new Date(),
        },
      });
      isPremium = !!user.isPremium;
    } else {
      console.log(`[SUMMARY] Unauth user: ${userId}`);
    }

    // 3. Определяем лимит
    let dailyLimit = UNAUTH_LIMIT;
    if (isAuthorized && isPremium) {
      dailyLimit = PREMIUM_LIMIT;
      console.log(`[SUMMARY] User is premium, no limit`);
    } else if (isAuthorized) {
      dailyLimit = AUTH_LIMIT;
      console.log(`[SUMMARY] User is authorized, limit = ${AUTH_LIMIT}`);
    } else {
      dailyLimit = UNAUTH_LIMIT;
      console.log(`[SUMMARY] User is unauth, limit = ${UNAUTH_LIMIT}`);
    }

    // 4. Премиум — безлимит
    if (isAuthorized && isPremium) {
      // Генерируем саммари без лимита
      try {
        const { text, model, detailLevel } = req.body;
        const summary = await generateSummary({ text, model, detailLevel });
        return res.json({ summary, requestsMade: 0, requestsLimit: null });
      } catch (err) {
        console.error('[SUMMARY] OpenRouter error (premium):', err);
        return res.status(500).json({ error: 'Ошибка генерации саммари (OpenRouter)' });
      }
    }

    // 5. Работа с лимитом
    const today = new Date();
    today.setUTCHours(0,0,0,0);
    let userLimit = await prisma.userLimit.findUnique({
      where: { userId_date: { userId, date: today } },
    });
    if (!userLimit) {
      console.log(`[SUMMARY] No limit record for user ${userId} on ${today.toISOString()}, creating new.`);
      // Для неавторизованных пользователей (userId не из Google) — создаём "гостевого" пользователя, если его нет
      if (!isAuthorized) {
        const guestUser = await prisma.user.upsert({
          where: { id: userId },
          update: {},
          create: {
            id: userId,
            email: `guest+${userId}@local`,
            name: 'Guest User',
            createdAt: new Date(),
            lastLogin: new Date(),
            isPremium: false
          }
        });
      }
      userLimit = await prisma.userLimit.create({
        data: {
          userId,
          date: today,
          requestsMade: 1,
          requestsLimit: dailyLimit,
        },
      });
    } else if (userLimit.requestsMade < dailyLimit) {
      // Если лимит был увеличен — обновить requestsLimit в базе
      if (userLimit.requestsLimit !== dailyLimit) {
        userLimit = await prisma.userLimit.update({
          where: { id: userLimit.id },
          data: { requestsLimit: dailyLimit }
        });
        console.log(`[SUMMARY] Updated requestsLimit for userLimit id=${userLimit.id} to ${dailyLimit}`);
      }
      console.log(`[SUMMARY] Incrementing requestsMade for userLimit id=${userLimit.id}`);
      userLimit = await prisma.userLimit.update({
        where: { id: userLimit.id },
        data: { requestsMade: { increment: 1 } },
      });
    } else {
      console.warn(`[SUMMARY] Daily limit exceeded for user ${userId} on ${today.toISOString()}`);
      return res.status(429).json({
        error: 'Daily limit exceeded',
        requestsMade: userLimit.requestsMade,
        requestsLimit: userLimit.requestsLimit
      });
    }
    // Генерация саммари через OpenRouter
    try {
      const { text, model, detailLevel } = req.body;
      const summary = await generateSummary({ text, model, detailLevel });
      console.log(`[SUMMARY] Success. userId=${userId} requestsMade=${userLimit.requestsMade} limit=${userLimit.requestsLimit}`);
      res.json({ summary, requestsMade: userLimit.requestsMade, requestsLimit: userLimit.requestsLimit });
    } catch (err) {
      if (typeof err.message === 'string' && err.message.startsWith('openrouter_limit:')) {
        console.error('[SUMMARY] OpenRouter daily limit exceeded:', err.message);
        return res.status(503).json({ error: 'OpenRouter daily limit exceeded' });
      }
      console.error('[SUMMARY] OpenRouter error:', err);
      res.status(500).json({ error: 'Ошибка генерации саммари (OpenRouter)' });
    }
  } catch (e) {
    console.error('[SUMMARY] Error:', e);
    res.status(401).json({ error: 'Invalid token or server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API listening on port ${PORT}`);
});
