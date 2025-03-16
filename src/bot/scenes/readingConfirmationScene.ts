import { Scenes } from 'telegraf';
import { Meter } from '~/api/meter';
import { mainMenuKeyboard } from '~/bot/keyboards/mainMenuKeyboard';
import { finalSceneKeyboard } from '~/bot/keyboards/inlineKeyboards';
import { MyContext } from '..';

const readingConfirmationScene = new Scenes.BaseScene<MyContext>('reading_confirmation');

readingConfirmationScene.enter(async (ctx) => {
  const reading = ctx.session.state.recognizedReading;
  await ctx.reply(
    `Подтвердите показания: ${reading}. Это верно?`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Да, верно', callback_data: 'confirm_reading' },
            { text: '❌ Нет, ввести заново', callback_data: 'reject_reading' }
          ]
        ]
      }
    }
  );
});

readingConfirmationScene.action('confirm_reading', async (ctx) => {
  await ctx.answerCbQuery();

  const selectedMeter = ctx.session.state.selectedMeter;
  const reading = ctx.session.state.recognizedReading;
  if(!selectedMeter || !reading) return;

  try {
    await new Meter().submitReading(selectedMeter.serialNumber, Number(reading.text));
    await ctx.reply(
      `✅ Спасибо! Показания ${reading.text} успешно переданы для счетчика ${selectedMeter.type} (${selectedMeter.serialNumber}).`,
      finalSceneKeyboard
    );
    return ctx.scene.enter('final');
  } catch (error) {
    return ctx.reply(
      '❌ Произошла ошибка при отправке показаний. Пожалуйста, попробуйте снова 2.',
      { reply_markup: mainMenuKeyboard.reply_markup }
    );
  }
});

readingConfirmationScene.action('reject_reading', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('Пожалуйста, введите показания заново:');
  return ctx.scene.enter('reading_input');
});

export default readingConfirmationScene;
