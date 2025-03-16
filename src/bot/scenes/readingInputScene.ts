import { message } from 'telegraf/filters';
import { Scenes } from 'telegraf';
import { RecognitionService } from '~/api/recognition/recognitionService';
import { EntityExtractor } from '~/nlp/entityExtractor';
import { readingInputMethodKeyboard, confirmReadingKeyboard } from '~/bot/keyboards/inlineKeyboards';
import { MyContext } from '..';

const recognitionService = new RecognitionService();
const entityExtractor = new EntityExtractor();

export const readingInputScene = new Scenes.BaseScene<MyContext>('reading_input');

readingInputScene.enter(async (ctx) => {
  const selectedMeter = ctx.session.state.selectedMeter;
  if (!selectedMeter) return;
  await ctx.reply(`
    Выберите способ передачи показаний для счетчика`,
    readingInputMethodKeyboard
  );
});

readingInputScene.action('send_photo', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('Пожалуйста, отправьте фотографию счетчика. Убедитесь, что показания хорошо видны.');
});

readingInputScene.action('manual_input', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('Пожалуйста, введите текущие показания счетчика:');
});

readingInputScene.on(message('text'), async (ctx) => {
  const text = ctx.message.text;
  const selectedMeter = ctx.session.state.selectedMeter;
  const recognizedReading = ctx.session.state.recognizedReading;
  const readingTextInput = entityExtractor.extractReading(text);

  if (!readingTextInput || !selectedMeter || !recognizedReading) {
    return ctx.reply('Не могу распознать показания. Пожалуйста, укажите числовое значение или отправьте фото счетчика.');
  }

  ctx.session.state.recognizedReading.text = String(readingTextInput);
  await ctx.reply(
    `Вы ввели показания: ${readingTextInput}, это верно ?`,
    confirmReadingKeyboard
  );
});

readingInputScene.on(message('photo'), async (ctx) => {
  const selectedMeter = ctx.session.state.selectedMeter;
  const photos = ctx.message.photo;
  const fileId = photos[photos.length - 1]?.file_id; // Берем фото с наилучшим качеством (последнее по дефолту в TG)
  if (!selectedMeter || !fileId) return;

  try {
    const fileUrl = await ctx.telegram.getFileLink(fileId);
    const imageResponse = await fetch(fileUrl.href);
    const data = await imageResponse.arrayBuffer();
    const imageBuffer = Buffer.from(data);

    await ctx.reply('Обрабатываю фото...');

    const recognitionResult = await recognitionService.recognizeReading(imageBuffer, selectedMeter.type);
    if ('details' in recognitionResult || 'error' in recognitionResult) {
      return await ctx.reply(`Произошла ошибка: ${recognitionResult.error ?? recognitionResult.details}`);
    }

    if (!recognitionResult || !recognitionResult.success) {
      return ctx.reply(
        'Не удалось распознать показания на фото. Пожалуйста, выберите другой способ:',
        readingInputMethodKeyboard
      );
    }

    ctx.session.state.recognizedReading = recognitionResult;
    await ctx.reply(
      `Я распознал показания: ${recognitionResult.text}, это верно ?`,
      confirmReadingKeyboard
    );
  } catch (error) {
    return ctx.reply(
      'Произошла ошибка при обработке фото. Пожалуйста, выберите другой способ:',
      { reply_markup: readingInputMethodKeyboard.reply_markup}
    );
  }
});

// Экспорт сцены
export default readingInputScene;
