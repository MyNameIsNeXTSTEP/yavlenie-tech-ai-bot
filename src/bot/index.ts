import { Telegraf, session, Scenes } from 'telegraf';
import { botConfig } from '~/config/botConfig';
import { setupScenes } from './scenes';
import { setupCommandHandlers } from './handlers/commandHandlers';
import { setupMessageHandlers } from './handlers/messageHandlers';
import { setupCallbackHandlers } from './handlers/callbackHandlers';
import { setupMainMenu } from './keyboards/mainMenuKeyboard';
import { OpenAIService } from '~/api/ai/openaiService';

const logger = console;

export const bot = new Telegraf<Scenes.SceneContext>(botConfig.token);
const openAIService = new OpenAIService(botConfig.openaiApiKey);

const stage = setupScenes();
bot.use(session());
bot.use(stage.middleware());

setupMainMenu(bot);
setupCommandHandlers(bot);
setupMessageHandlers(bot, openAIService);
setupCallbackHandlers(bot);

bot.catch((err, ctx) => {
  logger.error(`Ошибка для ${ctx.updateType}`, err);
  ctx.reply('Произошла ошибка. Пожалуйста, попробуйте снова или обратитесь в поддержку.');
});
