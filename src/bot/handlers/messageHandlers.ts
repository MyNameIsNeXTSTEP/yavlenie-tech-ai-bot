import { message } from 'telegraf/filters';
import { Telegraf, Scenes } from 'telegraf';
import { OpenAIService } from '~/api/ai/openaiService';
import { IntentRecognizer } from '~/nlp/intentRecognizer';
import { mainMenuKeyboard } from '~/bot/keyboards/mainMenuKeyboard';

const intentRecognizer = new IntentRecognizer();

export function setupMessageHandlers(bot: Telegraf<Scenes.SceneContext>, openAIService: OpenAIService) {
  // Обработка текстовых сообщений вне сцен
  bot.on(message('text'), async (ctx, next) => {
    // Если пользователь находится в сцене, передаем управление дальше
    if (ctx.scene.session.current) {
      return next();
    }

    const text = ctx.message.text;
    const intent = intentRecognizer.recognize(text);

    // Обработка известных намерений
    if (intent === 'identification') {
      
      return ctx.scene.enter('identification');
    }

    if (intent === 'submit_reading') {
      
      return ctx.scene.enter('identification');
    }

    if (intent === 'meter_selection') {
      
      return ctx.scene.enter('meter_selection');
    }

    if (intent === 'help') {
      return ctx.replyWithMarkdownV2(
        'Я помогу вам передать показания счетчиков. Вот что я умею:\n' +
        '• Идентифицировать вас по номеру лицевого счета\n' +
        '• Показать список ваших счетчиков\n' +
        '• Принимать показания в текстовом виде\n' +
        '• Распознавать показания по фото\n\n' +
        'Используйте меню для навигации.',
        { reply_markup: mainMenuKeyboard.reply_markup }
      );
    }

    // Если намерение не распознано, используем ChatGPT
    const aiResponse = await openAIService.processUserQuery(text);
    return await ctx.reply(aiResponse, { reply_markup: mainMenuKeyboard.reply_markup });
  });

  // Обработка фото вне сцен
  bot.on(message('photo'), (ctx, next) => {
    if (ctx.scene.session.current) {
      return next();
    }

    ctx.reply(
      'Я вижу, вы отправили фото. Если вы хотите передать показания счетчика, сначала выберите "📊 Передать показания" в меню.',
      { reply_markup: mainMenuKeyboard.reply_markup }
    );
  });
}
