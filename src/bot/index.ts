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
import { createAiFallbackMiddleware } from './middlewares/aiFallbackMiddleware';

const logger = console;

export interface MyContext <U extends Update = Update> extends Context<U> {
	session: {
    state: ISceneSessionState,
	},
};

/**
 * @todo
 * @typesIssues
 * Telegraf's typings issues has occured.
 * Whatever the typing of a `SceneContext` and `SceneSessionData` are, either the `IMySceneContext` fires errors,
 * or when creating a scene the state is not accessable in TS types, e.g.:
 * `const identificationScene = new Scenes.BaseScene<IMySceneContext>('identification');`
 * 
 * Need to deeply check how to correctly establish and use custom session state interfaces wihout any hacks.
 * Fow now, since it's just working, decided to ingore types mismatches.
 */
export interface IMySceneContext extends Scenes.SceneContext {
  scene: Scenes.SceneContextScene<IMySceneContext>;
  session: {
    state: ISceneSessionState;
  };
}

export const bot = new Telegraf<MyContext>(botConfig.token);
const openAIService = new OpenAIService(botConfig.openaiApiKey);

const aiFallbackMiddleware = createAiFallbackMiddleware(openAIService);
scenes.forEach(scene => scene.use(aiFallbackMiddleware));
  
const stage = new Scenes.Stage<Scenes.SceneContext<IMySceneContext>>(scenes);

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
