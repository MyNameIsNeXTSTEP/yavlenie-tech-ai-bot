import { Scenes } from 'telegraf';
import { Meter } from '~/api/meter';
import { useMeterSelectionKeyboard } from '~/bot/keyboards/inlineKeyboards';
import { MySceneContext } from '..';

const meterSelectionScene = new Scenes.BaseScene<MySceneContext>('meter_selection');

meterSelectionScene.enter(async (ctx) => {
  const sceneSession = ctx.session;
  console.info(sceneSession, 'SESSION INFO');
  if (!sceneSession) return;

  const replyOnError = async () => {
    await ctx.reply(`
      К сожалению не удалось определить ваши счетчики, прична может быть в:
      - Неверном коде счетка
      - У вас нет зарегистрированных счетчиков
      - Ошибке нашего сервера
    Давайте попробуем снова.
    `);
    return ctx.scene.enter('identification');
  };

  try {
    if (!sceneSession.state.meters) {
      console.error('Something went wrong in the "meterSelectionScene", there are no meters to wotk with');
      return await replyOnError();
    };
    /**
     * @todo @removeAfterTesting
     */
    const meters = [...sceneSession.state.meters, ...sceneSession.state.meters];
    if (meters.length === 1) {
      const selectedMeter = meters[0];
      if (!selectedMeter) {
        return await replyOnError();
      }
      sceneSession.state.selectedMeter = selectedMeter;
      await ctx.reply(`
        У вас один счетчик:\n
        id: ${selectedMeter.id}, тип: ${selectedMeter.type}, сер.номер: (${selectedMeter.serialNumber}).
      `);
      const meterInfo = await new Meter().info(selectedMeter.serialNumber);
      sceneSession.state.meterInfo = meterInfo;
      return ctx.scene.enter('reading_input');
    }

    await ctx.reply(
      'У вас несколько счетчиков. Выберите счетчик для передачи показаний:',
      useMeterSelectionKeyboard(meters),
    );
  } catch (error) {
    await ctx.reply('Произошла ошибка при получении списка счетчиков. Попробуйте снова.');
    console.error(error);
    return ctx.scene.enter('identification');
  }
});

export default meterSelectionScene;
