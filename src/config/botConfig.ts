// Конфигурация для Telegram-бота
export const botConfig = {
  // Токен Telegram-бота
  token: process.env.TELEGRAM_TOKEN || '',

  // API-ключ для OpenAI (для обработки нестандартных запросов)
  openaiApiKey: process.env.OPENAI_API_KEY || '',

  // Настройки для polling режима
  polling: {
    timeout: parseInt(process.env.POLLING_TIMEOUT || '30'),
    limit: parseInt(process.env.POLLING_LIMIT || '100')
  },

  // Список ID администраторов бота
  adminIds: (process.env.ADMIN_IDS || '').split(',').map(id => id.trim())
};
