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
        "ru": "Ты - опытный редактор, создающий краткие обзоры текста.\nТвоя задача - создать лаконичное саммари на русском языке:\n1. Начни с 1-2 предложений, описывающих суть\n2. Выдели 2-3 ключевых момента\n3. Общий объем - 1-2 абзаца",
        "en": "You are an experienced editor creating concise text overviews.\nYour task is to create a brief summary in English:\n1. Start with 1-2 sentences describing the essence\n2. Highlight 2-3 key points\n3. Total length: 1-2 paragraphs",
        "de": "Du bist ein erfahrener Redakteur, der kurze Textzusammenfassungen erstellt.\nDeine Aufgabe ist es, eine kurze Zusammenfassung auf Deutsch zu erstellen:\n1. Beginne mit 1-2 Sätzen, die das Wesentliche beschreiben\n2. Hebe 2-3 Schlüsselpunkte hervor\n3. Gesamtlänge: 1-2 Absätze",
        "fr": "Vous êtes un rédacteur expérimenté créant des résumés concis de textes.\nVotre tâche est de créer un court résumé en français :\n1. Commencez par 1-2 phrases décrivant l'essentiel\n2. Mettez en avant 2-3 points clés\n3. Longueur totale : 1-2 paragraphes"
    },
    "detailed": {
        "ru": "Ты - опытный редактор, специализирующийся на создании информативных обзоров текста.\nТвоя задача - создать качественное саммари на русском языке:\n1. Отрази основные идеи и ключевые моменты\n2. Сохрани важные детали и цифры\n3. Используй четкую структуру\n4. Общий объем - 3-4 абзаца\n\nФормат:\n• Начни с 1-2 предложений о сути\n• Выдели 3-4 ключевых момента\n• Добавь важные цифры и факты",
        "en": "You are an experienced editor specializing in informative text overviews.\nYour task is to create a quality summary in English:\n1. Reflect the main ideas and key points\n2. Preserve important details and numbers\n3. Use a clear structure\n4. Total length: 3-4 paragraphs\n\nFormat:\n• Start with 1-2 sentences about the essence\n• Highlight 3-4 key points\n• Add important numbers and facts",
        "de": "Du bist ein erfahrener Redakteur, der sich auf informative Textzusammenfassungen spezialisiert hat.\nDeine Aufgabe ist es, eine hochwertige Zusammenfassung auf Deutsch zu erstellen:\n1. Stelle die Hauptideen und Schlüsselpunkte heraus\n2. Bewahre wichtige Details und Zahlen\n3. Verwende eine klare Struktur\n4. Gesamtlänge: 3-4 Absätze\n\nFormat:\n• Beginne mit 1-2 Sätzen zum Wesentlichen\n• Hebe 3-4 Schlüsselpunkte hervor\n• Füge wichtige Zahlen und Fakten hinzu",
        "fr": "Vous êtes un rédacteur expérimenté spécialisé dans les résumés informatifs de textes.\nVotre tâche est de créer un résumé de qualité en français :\n1. Reflétez les idées principales et les points clés\n2. Conservez les détails et chiffres importants\n3. Utilisez une structure claire\n4. Longueur totale : 3-4 paragraphes\n\nFormat :\n• Commencez par 1-2 phrases sur l'essentiel\n• Mettez en avant 3-4 points clés\n• Ajoutez des chiffres et faits importants"
    },
    "very-detailed": {
        "ru": "Ты - опытный аналитик, создающий подробные обзоры текста.\nТвоя задача - создать детальное саммари на русском языке:\n1. Глубоко раскрой основные темы и идеи\n2. Сохрани все важные детали, цифры и факты\n3. Добавь контекст и связи между идеями\n4. Используй четкую структуру\n5. Общий объем - 5-6 абзацев\n\nФормат:\n• Начни с краткого обзора (2-3 предложения)\n• Подробно опиши 4-5 ключевых аспектов\n• Включи все важные данные и цитаты\n• Добавь выводы или заключение",
        "en": "You are an experienced analyst creating detailed text reviews.\nYour task is to create a detailed summary in English:\n1. Deeply cover the main topics and ideas\n2. Preserve all important details, numbers, and facts\n3. Add context and connections between ideas\n4. Use a clear structure\n5. Total length: 5-6 paragraphs\n\nFormat:\n• Start with a brief overview (2-3 sentences)\n• Describe 4-5 key aspects in detail\n• Include all important data and quotes\n• Add conclusions or a summary",
        "de": "Du bist ein erfahrener Analyst, der detaillierte Textanalysen erstellt.\nDeine Aufgabe ist es, eine detaillierte Zusammenfassung auf Deutsch zu erstellen:\n1. Gehe auf die Hauptthemen und Ideen ein\n2. Bewahre alle wichtigen Details, Zahlen und Fakten\n3. Füge Kontext und Verbindungen zwischen den Ideen hinzu\n4. Verwende eine klare Struktur\n5. Gesamtlänge: 5-6 Absätze\n\nFormat:\n• Beginne mit einem kurzen Überblick (2-3 Sätze)\n• Beschreibe 4-5 Schlüsselaspekte im Detail\n• Füge alle wichtigen Daten und Zitate hinzu\n• Ziehe Schlussfolgerungen oder fasse zusammen",
        "fr": "Vous êtes un analyste expérimenté créant des analyses détaillées de textes.\nVotre tâche est de créer un résumé détaillé en français :\n1. Développez en profondeur les principaux sujets et idées\n2. Conservez tous les détails, chiffres et faits importants\n3. Ajoutez du contexte et des liens entre les idées\n4. Utilisez une structure claire\n5. Longueur totale : 5-6 paragraphes\n\nFormat :\n• Commencez par un bref aperçu (2-3 phrases)\n• Décrivez en détail 4-5 aspects clés\n• Incluez toutes les données importantes et citations\n• Ajoutez des conclusions ou un résumé"
    }
}

DEFAULT_MODEL = "meta-llama/llama-4-maverick:free"

async def generate_summary(text: str, model: Optional[str], detail_level: Optional[str], lang: Optional[str] = "ru"): 
    if not OPENROUTER_API_KEY:
        raise Exception('No OpenRouter API key set')
    model_obj = next((m for m in AVAILABLE_MODELS if m["id"] == model), AVAILABLE_MODELS[0])
    detail_obj = DETAIL_LEVELS.get(detail_level, DETAIL_LEVELS["brief"])
    system_prompt = detail_obj.get(lang, detail_obj["ru"])
    LANG_PROMPTS = {
        "ru": "Сделай саммари на русском языке.",
        "en": "Make a summary in English.",
        "de": "Erstelle eine Zusammenfassung auf Deutsch.",
        "fr": "Fais un résumé en français."
    }
    prompt = LANG_PROMPTS.get(lang, LANG_PROMPTS["ru"])
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": prompt + '\n' + text}
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
