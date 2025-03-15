import { Telegraf, Scenes } from 'telegraf';
import { CounterService } from '~/api/counter/counterService';

const counterService = new CounterService();

export function setupCallbackHandlers(bot: Telegraf<Scenes.SceneContext>) {
  // Обработка подтверждения показаний
  bot.action('confirm_reading', async (ctx) => {
    await ctx.answerCbQuery();

    const counter = ctx.scene.state.selectedCounter;
    const reading = ctx.scene.state.recognizedReading;

    try {
      await counterService.submitReading(counter.id, reading);
      await ctx.reply(`✅ Спасибо! Показания ${reading} успешно переданы для счетчика ${counter.type} (${counter.number}).`);
      return ctx.scene.enter('final');
    } catch (error) {
      return ctx.reply('❌ Произошла ошибка при отправке показаний. Пожалуйста, попробуйте снова.');
    }
  });

  // Обработка отклонения показаний
  bot.action('reject_reading', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('Пожалуйста, введите показания заново:');
  });

  // Обработка выбора счетчика
  bot.action(/select_counter_(\d+)/, async (ctx) => {
    await ctx.answerCbQuery();

    const counterIndex = parseInt(ctx.match[1]);
    const counters = ctx.scene.state.counters;

    if (counterIndex >= 0 && counterIndex < counters.length) {
      ctx.scene.state.selectedCounter = counters[counterIndex];
      await ctx.reply(`Вы выбрали счетчик: ${counters[counterIndex].type} (${counters[counterIndex].number}).`);
      return ctx.scene.enter('reading_input');
    }
  });

  // Обработка финальных действий
  bot.action('another_counter', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.scene.enter('counter_selection');
  });

  bot.action('finish', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('Спасибо за использование нашего сервиса! Если вам понадобится передать показания снова, просто напишите мне.');
    return ctx.scene.leave();
  });
}
