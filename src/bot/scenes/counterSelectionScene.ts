import { Scenes } from 'telegraf';
import { CounterService } from '~/api/counter/counterService';
import { createCounterSelectionKeyboard } from '~/bot/keyboards/inlineKeyboards';

const counterService = new CounterService();

const counterSelectionScene = new Scenes.BaseScene<Scenes.SceneContext>('counter_selection');

counterSelectionScene.enter(async (ctx) => {
  const account = ctx.scene.state.account;
  try {
    const counters = await counterService.getCountersByAccount(account.id);
    ctx.scene.state.counters = counters;

    if (counters.length === 0) {
      await ctx.reply('У вас нет зарегистрированных счетчиков.');
      return ctx.scene.enter('identification');
    }

    if (counters.length === 1) {
      ctx.scene.state.selectedCounter = counters[0];
      await ctx.reply(`У вас один счетчик: ${counters[0].type} (${counters[0].number}).`);
      return ctx.scene.enter('reading_input');
    }

    await ctx.reply(
      'У вас несколько счетчиков. Выберите счетчик для передачи показаний:',
      createCounterSelectionKeyboard(counters)
    );
  } catch (error) {
    await ctx.reply('Произошла ошибка при получении списка счетчиков. Попробуйте снова.');
    return ctx.scene.enter('identification');
  }
});

export default counterSelectionScene;