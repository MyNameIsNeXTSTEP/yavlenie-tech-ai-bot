import './config';      
import { botConfig } from './config';
import { bot } from './bot';
import { ISceneSessionState } from './bot/types';
import { SceneSession } from 'telegraf/typings/scenes';
import { IMeter, IMeterInfo } from './api/meter/types';

const logger = console;

(
  async () => {
    try {
      if (!botConfig.token) {
        logger.error('Bot token is missing. Please check your .env file');
        process.exit(1);
      }
      // await bot.launch();
      bot.start(async (ctx) => {
        ctx.session = ctx.session || {};
        ctx.session = ctx.session as SceneSession<ISceneSessionState> || {
          state: {
            meters: [] as IMeter[],
            meterInfo: {} as IMeterInfo,
            selectedMeter: {} as IMeter,
            recognizedReading: 0,
          },
        };
        return await ctx.scene.enter('identification');
      });
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
