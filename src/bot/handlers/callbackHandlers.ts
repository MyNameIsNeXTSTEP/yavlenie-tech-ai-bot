import { Telegraf, Scenes } from 'telegraf';
import { Meter } from '~/api/meter';
import { ISceneSessionState } from '../types';

export function setupCallbackHandlers(bot: Telegraf<Scenes.SceneContext>) {
  // Обработка подтверждения показаний
  bot.action('confirm_reading', async (ctx) => {
    await ctx.answerCbQuery();

    const meter = (ctx.scene.state as ISceneSessionState).selectedMeter;
    const reading = (ctx.scene.state as ISceneSessionState).recognizedReading;

    try {
      await new Meter().submitReading(meter.id, reading);
      await ctx.reply(`✅ Спасибо! Показания ${reading} успешно переданы для счетчика ${meter.type} (${meter.number}).`);
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
  bot.action(/select_meter_(\d+)/, async (ctx) => {
    await ctx.answerCbQuery();

    const meterIndex = parseInt(ctx.match[1]);
    const meters = (ctx.scene.state as ISceneSessionState).meters;

    if (meters?.length && meterIndex >= 0 && meterIndex < meters.length) {
      (ctx.scene.state as ISceneSessionState).selectedMeter = meters[meterIndex];
      await ctx.reply(`Вы выбрали счетчик\nтип:${meters[meterIndex]?.type} сер.номер: (${meters[meterIndex]?.serialNumber}).`);
      return ctx.scene.enter('reading_input');
    }
  });

  // Обработка финальных действий
  bot.action('another_meter', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.scene.enter('meter_selection');
  });

  bot.action('finish', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('Спасибо за использование нашего сервиса! Если вам понадобится передать показания снова, просто напишите мне.');
    return ctx.scene.leave();
  });
}
