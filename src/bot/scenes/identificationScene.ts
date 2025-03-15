import { message } from 'telegraf/filters';
import { Scenes } from 'telegraf';
import { Meter } from '~/api/meter';
import { EntityExtractor } from '~/nlp/entityExtractor';
import { mainMenuKeyboard } from '~/bot/keyboards/mainMenuKeyboard';
import { SceneState } from '~/bot/types';

const entityExtractor = new EntityExtractor();

const identificationScene = new Scenes.BaseScene<Scenes.SceneContext>('identification');

identificationScene.enter(async (ctx) => {
  await ctx.reply(
    'Для начала работы, пожалуйста, укажите номер вашего лицевого счета или договора:',
    { reply_markup: { remove_keyboard: true } }
  );
});

identificationScene.on(message('text'), async (ctx) => {
  const text = ctx.message.text;
  const accountNumber = entityExtractor.extractAccountNumber(text);

  if (!accountNumber) {
    return ctx.reply('Не могу распознать номер лицевого счета. Пожалуйста, укажите его в формате: XXXXXXX');
  }

  try {
    const account = await new Meter().ofAccount(accountNumber);
    (ctx.scene.state as SceneState).account = account;
    await ctx.reply(
      `Спасибо! Я нашел ваш аккаунт:\n, ${account.id} (тип: ${account.type}, сер. номер: ${account.serialNumber}).`,
      { reply_markup: mainMenuKeyboard.reply_markup }
    );
    return ctx.scene.enter('meter_selection');
  } catch (error) {
    return ctx.reply(
      'Не удалось найти лицевой счет. Пожалуйста, проверьте номер и попробуйте снова.',
      { reply_markup: mainMenuKeyboard.reply_markup }
    );
  }
});

export default identificationScene;
