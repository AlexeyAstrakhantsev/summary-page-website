import os
import httpx
from typing import Optional

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

AVAILABLE_MODELS = [
    {
        "id": "meta-llama/llama-4-maverick:free",
        "name": "Llama 4 Maverick",
        "prompt": "Сделай краткое структурированное саммари на русском языке."
    },
    {
        "id": "deepseek/deepseek-v3-base:free",
        "name": "DeepSeek V3 Base",
        "prompt": "Сделай подробное саммари на русском языке."
    },
    {
        "id": "google/gemini-2.5-pro-exp-03-25:free",
        "name": "Gemini 2.5 Pro",
        "prompt": "Сделай саммари для специалистов."
    },
    {
        "id": "qwen/qwen2.5-vl-32b-instruct:free",
        "name": "Qwen2.5 VL 32B",
        "prompt": "Сделай краткое саммари с ключевыми фактами."
    }
]

DETAIL_LEVELS = {
    "brief": {
        "systemPrompt": "Ты - опытный редактор, создающий краткие обзоры текста. \nТвоя задача - создать лаконичное саммари на русском языке:\n1. Начни с 1-2 предложений, описывающих суть\n2. Выдели 2-3 ключевых момента\n3. Общий объем - 1-2 абзаца"
    },
    "detailed": {
        "systemPrompt": "Ты - опытный редактор, специализирующийся на создании информативных обзоров текста. \nТвоя задача - создать качественное саммари на русском языке:\n1. Отрази основные идеи и ключевые моменты\n2. Сохрани важные детали и цифры\n3. Используй четкую структуру\n4. Общий объем - 3-4 абзаца\n\nФормат:\n• Начни с 1-2 предложений о сути\n• Выдели 3-4 ключевых момента\n• Добавь важные цифры и факты"
    },
    "very-detailed": {
        "systemPrompt": "Ты - опытный аналитик, создающий подробные обзоры текста. \nТвоя задача - создать детальное саммари на русском языке:\n1. Глубоко раскрой основные темы и идеи\n2. Сохрани все важные детали, цифры и факты\n3. Добавь контекст и связи между идеями\n4. Используй четкую структуру\n5. Общий объем - 5-6 абзацев\n\nФормат:\n• Начни с краткого обзора (2-3 предложения)\n• Подробно опиши 4-5 ключевых аспектов\n• Включи все важные данные и цитаты\n• Добавь выводы или заключение"
    }
}

DEFAULT_MODEL = "meta-llama/llama-4-maverick:free"

async def generate_summary(text: str, model: Optional[str], detail_level: Optional[str]):
    if not OPENROUTER_API_KEY:
        raise Exception('No OpenRouter API key set')
    model_obj = next((m for m in AVAILABLE_MODELS if m["id"] == model), AVAILABLE_MODELS[0])
    detail_obj = DETAIL_LEVELS.get(detail_level, DETAIL_LEVELS["brief"])
    messages = [
        {"role": "system", "content": detail_obj["systemPrompt"]},
        {"role": "user", "content": model_obj["prompt"] + '\n' + text}
    ]
    try:
        response = await httpx.AsyncClient(timeout=60).post(
            OPENROUTER_API_URL,
            json={"model": model_obj["id"], "messages": messages, "stream": False},
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://summary-page.online",
                "X-Title": "Summary Page"
            }
        )
        response.raise_for_status()
    except httpx.HTTPStatusError as err:
        if err.response.status_code in (429, 403):
            raise Exception("openrouter_limit:" + err.response.text)
        raise
    data = response.json()
    summary = (
        data.get("choices", [{}])[0].get("message", {}).get("content")
        if data and "choices" in data else "[empty]"
    )
    if not summary:
        raise Exception("No summary returned from OpenRouter")
    return summary
