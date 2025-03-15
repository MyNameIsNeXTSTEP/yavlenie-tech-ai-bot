export const apiConfig = {
  // URL для API счетчиков
  meterApiUrl: process.env.COUNTER_API_URL || 'https://task1.interview.yavlenie.pro',

  // URL для API распознавания
  recognitionApiUrl: process.env.RECOGNITION_API_URL || 'https://api.cv-blueberry.yavlenie.pro/v1',

  // API-ключ для сервиса распознавания
  recognitionApiKey: process.env.API_KEY || '',

  // Таймаут для запросов к API (в миллисекундах)
  requestTimeout: parseInt(process.env.API_REQUEST_TIMEOUT || '5000')
};
