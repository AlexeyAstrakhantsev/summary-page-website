const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Маппинг моделей и уровней детализации
const AVAILABLE_MODELS = [
  {
    id: "meta-llama/llama-4-maverick:free",
    name: "Llama 4 Maverick",
    prompt: "Сделай краткое структурированное саммари на русском языке."
  },
  {
    id: "deepseek/deepseek-v3-base:free",
    name: "DeepSeek V3 Base",
    prompt: "Сделай подробное саммари на русском языке."
  },
  {
    id: "google/gemini-2.5-pro-exp-03-25:free",
    name: "Gemini 2.5 Pro",
    prompt: "Сделай саммари для специалистов."
  },
  {
    id: "qwen/qwen2.5-vl-32b-instruct:free",
    name: "Qwen2.5 VL 32B",
    prompt: "Сделай краткое саммари с ключевыми фактами."
  }
];

const DETAIL_LEVELS = {
  brief: {
    systemPrompt: `Ты - опытный редактор, создающий краткие обзоры текста. 
Твоя задача - создать лаконичное саммари на русском языке:
1. Начни с 1-2 предложений, описывающих суть
2. Выдели 2-3 ключевых момента
3. Общий объем - 1-2 абзаца`
  },
  detailed: {
    systemPrompt: `Ты - опытный редактор, специализирующийся на создании информативных обзоров текста. 
Твоя задача - создать качественное саммари на русском языке:
1. Отрази основные идеи и ключевые моменты
2. Сохрани важные детали и цифры
3. Используй четкую структуру
4. Общий объем - 3-4 абзаца
\nФормат:
• Начни с 1-2 предложений о сути
• Выдели 3-4 ключевых момента
• Добавь важные цифры и факты`
  },
  'very-detailed': {
    systemPrompt: `Ты - опытный аналитик, создающий подробные обзоры текста. 
Твоя задача - создать детальное саммари на русском языке:
1. Глубоко раскрой основные темы и идеи
2. Сохрани все важные детали, цифры и факты
3. Добавь контекст и связи между идеями
4. Используй четкую структуру
5. Общий объем - 5-6 абзацев
\nФормат:
• Начни с краткого обзора (2-3 предложения)
• Подробно опиши 4-5 ключевых аспектов
• Включи все важные данные и цитаты
• Добавь выводы или заключение`
  }
};

const DEFAULT_MODEL = "meta-llama/llama-4-maverick:free";

async function generateSummary({ text, model, detailLevel }) {
  if (!OPENROUTER_API_KEY) throw new Error('No OpenRouter API key set');

  // Найти модель и уровень детализации
  const modelObj = AVAILABLE_MODELS.find(m => m.id === model) || AVAILABLE_MODELS[0];
  const detailObj = DETAIL_LEVELS[detailLevel] || DETAIL_LEVELS.brief;

  const messages = [
    { role: 'system', content: detailObj.systemPrompt },
    { role: 'user', content: modelObj.prompt + '\n' + text }
  ];
  // Логируем что отправляем на openrouter
  console.log('[OPENROUTER][REQ] model:', modelObj.id, 'detailLevel:', detailLevel, 'text:', text ? text.slice(0, 500) + (text.length > 500 ? '... [truncated]' : '') : '[empty]');

  let response;
  try {
    response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: modelObj.id,
        messages,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://summary-page.online',
          'X-Title': 'Summary Page'
        },
        timeout: 60000
      }
    );
  } catch (err) {
    if (err.response && (err.response.status === 429 || err.response.status === 403)) {
      // Лимит OpenRouter исчерпан
      console.error('[OPENROUTER][ERR] OpenRouter daily limit exceeded:', err.response.data);
      const errorMsg = err.response.data?.error?.message || err.response.data?.error || 'OpenRouter daily limit exceeded';
      throw new Error('openrouter_limit:' + errorMsg);
    } else {
      console.error('[OPENROUTER][ERR] Unexpected error:', err);
      throw err;
    }
  }

  // Логируем ответ openrouter (первые 500 символов summary)
  const summary = response.data && response.data.choices && response.data.choices[0].message.content
    ? response.data.choices[0].message.content
    : '[empty]';
  console.log('[OPENROUTER][RES] summary:', summary.slice(0, 500) + (summary.length > 500 ? '... [truncated]' : ''));

  if (response.data && response.data.choices && response.data.choices[0].message.content) {
    // Лог финального ответа
    console.log('[OPENROUTER][OUT] summary length:', summary.length);
    return summary;
  } else {
    throw new Error('No summary returned from OpenRouter');
  }
}

module.exports = {
  generateSummary,
  AVAILABLE_MODELS,
  DETAIL_LEVELS,
  DEFAULT_MODEL
};
