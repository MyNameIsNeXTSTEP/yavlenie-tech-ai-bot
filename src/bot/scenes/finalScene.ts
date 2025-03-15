import { Scenes } from 'telegraf';
import { mainMenuKeyboard } from '~/bot/keyboards/mainMenuKeyboard';

const finalScene = new Scenes.BaseScene<Scenes.SceneContext>('final');

finalScene.enter(async (ctx) => {
  await ctx.reply(
    'Хотите передать показания для другого счетчика?',
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Да, еще счетчик', callback_data: 'another_counter' },
            { text: '❌ Нет, завершить', callback_data: 'finish' }
          ]
        ]
      }
    }
  );
});

finalScene.action('another_counter', async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.scene.enter('counter_selection');
});

finalScene.action('finish', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    'Спасибо за использование нашего сервиса! Если вам понадобится передать показания снова, просто напишите мне.',
    { reply_markup: mainMenuKeyboard }
  );
  return ctx.scene.leave();
});

export default finalScene;
