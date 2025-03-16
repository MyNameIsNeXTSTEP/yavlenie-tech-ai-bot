import { message } from 'telegraf/filters';
import { Scenes } from 'telegraf';
import { Meter } from '~/api/meter';
import { EntityExtractor } from '~/nlp/entityExtractor';
import { mainMenuKeyboard } from '~/bot/keyboards/mainMenuKeyboard';
import { ISceneSessionState } from '~/bot/types';

const entityExtractor = new EntityExtractor();
const identificationScene = new Scenes.BaseScene<Scenes.SceneContext<ISceneSessionState>>('identification');

identificationScene.enter(async (ctx) => {
  await ctx.reply(
    'Для начала работы, пожалуйста, укажите номер вашего лицевого счета или договора:',
    { reply_markup: { remove_keyboard: true } }
  );
});

identificationScene.on(message('text'), async (ctx) => {
  const sceneSession = ctx.session.__scenes;
  if (!sceneSession) return;

  const text = ctx.message.text;
  const accountNumber = entityExtractor.extractAccountNumber(text);

  if (!accountNumber) {
    return ctx.reply(`Не могу распознать номер лицевого счета.\nПожалуйста, укажите его в соответствующем числовом формате, например: 1002.`);
  }

  try {
    const metersResponse = await new Meter().ofAccount(accountNumber);
    /**
     * @todo
     * Since the API https://task1.interview.yavlenie.pro/api-docs/#/default/get_meters__accountNumber_
     * responses with one meter per an acocunt, but considered to response with an array of meters,
     * there come up a need to often process both variants due to the test task description:
     * "Определяет связанные счётчики (на один договор может быть несколько)."
     * 
     * Need to fix this later on the API side (response always with an array), then fix bot client upon it!
     */
    const meters = Array.isArray(metersResponse) ? metersResponse : [metersResponse];
    sceneSession.state.meters = meters;
    
    const metersReply = meters.map(el => `id: ${el.id}, тип: ${el.type}, сер. номер: ${el.serialNumber}.`);
    await ctx.reply(
      `Вашы счетчики:\n${metersReply}`,
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
