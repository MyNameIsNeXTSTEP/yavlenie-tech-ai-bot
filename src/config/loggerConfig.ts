// Конфигурация для логгера
export const loggerConfig = {
  // Уровень логирования
  level: process.env.LOG_LEVEL || 'info',

  // Путь к файлу с логами
  filePath: process.env.LOG_FILE_PATH || 'logs/app.log',

  // Максимальный размер файла логов (в байтах)
  maxSize: parseInt(process.env.LOG_MAX_SIZE || '10485760'), // 10MB по умолчанию

  // Максимальное количество файлов логов
  maxFiles: parseInt(process.env.LOG_MAX_FILES || '5')
};
