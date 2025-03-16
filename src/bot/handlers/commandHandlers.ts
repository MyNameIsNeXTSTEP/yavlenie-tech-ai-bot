import { Telegraf, Scenes  } from 'telegraf';
import { mainMenuKeyboard } from '~/bot/keyboards/mainMenuKeyboard'
import { DialogManager } from '~/domain/dialogManager';

export function setupCommandHandlers(bot: Telegraf<Scenes.SceneContext>) {
  bot.command('start', async (ctx) => {
    // Сбрасываем текущий диалог, если он есть
    await DialogManager.resetDialog(ctx);

    await ctx.reply(
      'Добро пожаловать в сервис передачи показаний счетчиков! Я помогу вам передать показания быстро и удобно.',
      { reply_markup: mainMenuKeyboard.reply_markup }
    );
  });

  // Обработка команды /help
  bot.command('help', async (ctx) => {
    await ctx.replyWithMarkdown(
      'Я помогу вам передать показания счетчиков. Вот что я умею:\n' +
      '• Идентифицировать вас по номеру лицевого счета\n' +
      '• Показать список ваших счетчиков\n' +
      '• Принимать показания в текстовом виде\n' +
      '• Распознавать показания по фото\n\n' +
      'Используйте меню для навигации или просто напишите мне свой вопрос.',
      { reply_markup: mainMenuKeyboard.reply_markup }
    );
  });

  // Обработка команды /account
  bot.command('account', async (ctx) => {
    await ctx.scene.enter('identification');
  });

  // Обработка команды /readings
  bot.command('readings', async (ctx) => {
    await DialogManager.startReadingFlow(ctx);
  });

  // Обработка команды /cancel
  bot.command('cancel', async (ctx) => {
    await DialogManager.resetDialog(ctx);

    await ctx.reply(
      'Текущая операция отменена. Чем я могу помочь?',
      { reply_markup: mainMenuKeyboard.reply_markup }
    );
  });
}
