import { Telegraf, session, Scenes, type Context } from 'telegraf';
import type { Update } from "telegraf/types";

import { botConfig } from '~/config/botConfig';
import { setupCommandHandlers } from './handlers/commandHandlers';
import { setupMessageHandlers } from './handlers/messageHandlers';
import { setupCallbackHandlers } from './handlers/callbackHandlers';
import { setupMainMenu } from './keyboards/mainMenuKeyboard';
import { OpenAIService } from '~/api/ai/openaiService';
import { ISceneSessionState } from './types';

import scenes from './scenes';
import { IMeter, IMeterInfo } from '~/api/meter/types';

const logger = console;

export interface MyContext <U extends Update = Update> extends Context<U> {
	session: {
    state: ISceneSessionState,
	},
};

export interface MySceneContext extends Scenes.SceneContext {
  scene: Scenes.SceneContextScene<MySceneContext>;
  session: {
    state: ISceneSessionState;
  };
}

export const bot = new Telegraf<MyContext>(botConfig.token);
const openAIService = new OpenAIService(botConfig.openaiApiKey);

const stage = new Scenes.Stage<Scenes.SceneContext<MySceneContext>>(scenes);

bot.use(
  session({
    defaultSession:
      () => ({
        state: {
          meters: [] as IMeter[],
          meterInfo: {} as IMeterInfo,
          selectedMeter: {} as IMeter,
          recognizedReading: 0,
        },
      })
  })
);
bot.use(stage.middleware());

setupMainMenu(bot);
setupCommandHandlers(bot);
setupMessageHandlers(bot, openAIService);
setupCallbackHandlers(bot);

bot.catch((err, ctx) => {
  logger.error(`Ошибка для ${ctx.updateType}`, err);
  ctx.reply('Произошла ошибка. Пожалуйста, попробуйте снова или обратитесь в поддержку.');
});
