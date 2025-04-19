const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

// Настройки базы и порта (SQLite файл и порт сервера)
const DATABASE_URL = "file:./dev.db";
const PORT = 4000;

const prisma = new PrismaClient({
  datasources: {
    db: { url: DATABASE_URL }
  }
});
const app = express();
app.use(cors());
app.use(express.json());

// Google OAuth token verification
async function verifyGoogleToken(idToken) {
  const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
  const { data } = await axios.get(url);
  if (!data.sub) throw new Error('Invalid Google token');
  return data;
}

// POST /api/verify
app.post('/api/verify', async (req, res) => {
  try {
    const { token } = req.body;
    const info = await verifyGoogleToken(token);
    // Upsert user
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
    res.json({ userId: user.id, email: user.email, name: user.name });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// POST /api/generate-summary
app.post('/api/generate-summary', async (req, res) => {
  try {
    const { token, ...payload } = req.body;
    const info = await verifyGoogleToken(token);
    const userId = info.sub;
    // Get or create user
    const user = await prisma.user.upsert({
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
    // Date key for today (UTC)
    const today = new Date();
    today.setUTCHours(0,0,0,0);
    // Get or create limit record
    let userLimit = await prisma.userLimit.findUnique({
      where: { userId_date: { userId, date: today } },
    });
    if (!userLimit) {
      userLimit = await prisma.userLimit.create({
        data: {
          userId,
          date: today,
          requestsMade: 1,
          requestsLimit: 10,
        },
      });
    } else if (userLimit.requestsMade < userLimit.requestsLimit) {
      userLimit = await prisma.userLimit.update({
        where: { id: userLimit.id },
        data: { requestsMade: { increment: 1 } },
      });
    } else {
      return res.status(429).json({ error: 'Daily limit exceeded' });
    }
    // TODO: Call your summary-generation logic here
    // For now, just return a stub
    res.json({ summary: 'Summary would be generated here.', requestsMade: userLimit.requestsMade, requestsLimit: userLimit.requestsLimit });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token or server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API listening on port ${PORT}`);
});
