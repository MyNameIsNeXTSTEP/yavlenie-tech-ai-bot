import { Scenes } from 'telegraf';
import { CounterService } from '~/api/counter/counterService';
import { mainMenuKeyboard } from '~/bot/keyboards/mainMenuKeyboard';
import { finalSceneKeyboard } from '~/bot/keyboards/inlineKeyboards';

const counterService = new CounterService();

const readingConfirmationScene = new Scenes.BaseScene<Scenes.SceneContext>('reading_confirmation');

readingConfirmationScene.enter(async (ctx) => {
  const reading = ctx.scene.state.recognizedReading;
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

  const counter = ctx.scene.state.selectedCounter;
  const reading = ctx.scene.state.recognizedReading;

  try {
    await counterService.submitReading(counter.id, reading);
    await ctx.reply(
      `✅ Спасибо! Показания ${reading} успешно переданы для счетчика ${counter.type} (${counter.number}).`,
      finalSceneKeyboard
    );
    return ctx.scene.enter('final');
  } catch (error) {
    return ctx.reply(
      '❌ Произошла ошибка при отправке показаний. Пожалуйста, попробуйте снова.',
      { reply_markup: mainMenuKeyboard }
    );
  }
});

readingConfirmationScene.action('reject_reading', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('Пожалуйста, введите показания заново:');
  return ctx.scene.enter('reading_input');
});

export default readingConfirmationScene;
