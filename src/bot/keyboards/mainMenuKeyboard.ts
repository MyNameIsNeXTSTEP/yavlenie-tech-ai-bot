import { Telegraf, Markup, Scenes } from 'telegraf';

export function setupMainMenu(bot: Telegraf<Scenes.SceneContext>) {
  bot.use(async (ctx, next) => {
    await ctx.telegram.setMyCommands([
      { command: 'start', description: 'Начать работу с ботом' },
      { command: 'account', description: 'Ввести номер лицевого счета' },
      { command: 'readings', description: 'Передать показания' },
      { command: 'help', description: 'Получить справку' }
    ]);
    return next();
  });
};

export const mainMenuKeyboard = Markup.keyboard([
  ['📊 Передать показания', '📝 Ввести лицевой счет'],
  ['❓ Помощь', '📞 Связаться с оператором']
]).resize();
