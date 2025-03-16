import { Telegraf } from 'telegraf';
import { Meter } from '~/api/meter';
import { IMySceneContext } from '..';

export function setupCallbackHandlers(bot: Telegraf<IMySceneContext>) {
  bot.action('confirm_reading', async (ctx) => {
    await ctx.answerCbQuery();
    const selectedMeter = ctx.session.state.selectedMeter;
    const reading = ctx.session.state.recognizedReading;
    if (!selectedMeter || !reading) return;
    try {
      const resp = await new Meter().submitReading(selectedMeter.serialNumber, reading);
      if ('error' in resp) {
        await ctx.reply(`❌ Произошла ошибка: ${resp.error}\nДавайте попробуем снова.`);
        return ctx.scene.enter('meter_selection');
      }
      await ctx.reply(`
        ✅ Спасибо! Показания ${reading.text} успешно переданы для счетчика - тип: ${selectedMeter.type} сер. номер: (${selectedMeter?.serialNumber}).
      `);
      return ctx.scene.enter('final');
    } catch (error) {
      return ctx.reply('❌ Произошла ошибка при отправке показаний. Пожалуйста, попробуйте снова.');
    }
  });

  bot.action('reject_reading', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('Пожалуйста, введите показания заново:');
  });

  bot.action(/select_meter_(\d+)/, async (ctx) => {
    await ctx.answerCbQuery();
    const meterIndex = parseInt(ctx.match[1]);
    const meters = ctx.session.state.meters;
    if (meters?.length && meterIndex >= 0 && meterIndex <= meters.length) {
      ctx.session.state.selectedMeter = meters[meterIndex];
      await ctx.reply(`Вы выбрали счетчик\nтип:${meters[meterIndex]?.type} сер.номер: (${meters[meterIndex]?.serialNumber}).`);
      return ctx.scene.enter('reading_input');
    }
  });

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
