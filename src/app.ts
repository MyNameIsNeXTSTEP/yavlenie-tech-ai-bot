import './config';      
import { botConfig } from './config';
import { bot } from './bot';

const logger = console;

(
  async () => {
    try {
      if (!botConfig.token) {
        logger.error('Bot token is missing. Please check your .env file');
        process.exit(1);
      }
      await bot.launch();
      logger.info('Бот успешно запущен в режиме polling');
    
      process.once('SIGINT', () => {
        bot.stop('SIGINT');
        logger.info('Бот остановлен по SIGINT');
      });
    
      process.once('SIGTERM', () => {
        bot.stop('SIGTERM');
        logger.info('Бот остановлен по SIGTERM');
      });
    } catch (error) {
      logger.error('Ошибка при запуске приложения', error);
      process.exit(1);
    }
  }
)();
