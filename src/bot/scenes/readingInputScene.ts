import { message } from 'telegraf/filters';
import { Scenes } from 'telegraf';
import { Meter } from '~/api/meter';
import { RecognitionService } from '~/api/recognition/recognitionService';
import { EntityExtractor } from '~/nlp/entityExtractor';
import { readingInputMethodKeyboard, confirmReadingKeyboard } from '~/bot/keyboards/inlineKeyboards';
import { SceneState } from '~/bot/types';

const recognitionService = new RecognitionService();
const entityExtractor = new EntityExtractor();

export const readingInputScene = new Scenes.BaseScene<Scenes.SceneContext>('reading_input');

readingInputScene.enter(async (ctx) => {
  const counter = (ctx.scene.state as SceneState).selectedMeter;
  await ctx.reply(
    `Выберите способ передачи показаний для счетчика ${counter.type} (${counter.number}):`,
    readingInputMethodKeyboard
  );
});

// Обработка callback-запросов
readingInputScene.action('send_photo', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('Пожалуйста, отправьте фотографию счетчика. Убедитесь, что показания хорошо видны.');
});

readingInputScene.action('manual_input', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('Пожалуйста, введите текущие показания счетчика:');
});

// Обработка текстовых сообщений
readingInputScene.on(message('text'), async (ctx) => {
  const text = ctx.message.text;
  const counter = (ctx.scene.state as SceneState).selectedMeter;

  // Извлечение показаний из текста
  const reading = entityExtractor.extractReading(text);

  if (!reading) {
    return ctx.reply('Не могу распознать показания. Пожалуйста, укажите числовое значение или отправьте фото счетчика.');
  }

  (ctx.scene.state as SceneState).recognizedReading = reading;
  await ctx.reply(
    `Вы ввели показания: ${reading}. Это верно?`,
    confirmReadingKeyboard
  );
});

// Обработка фотографий
readingInputScene.on(message('photo'), async (ctx) => {
  const counter = (ctx.scene.state as SceneState).selectedMeter;
  const photos = ctx.message.photo;
  const fileId = photos[photos.length - 1]?.file_id; // Берем фото с наилучшим качеством
  if (!fileId) return;

  try {
    const fileUrl = await ctx.telegram.getFileLink(fileId);
    const response = await fetch(fileUrl.href);
    const data = await response.arrayBuffer();
    const imageBuffer = Buffer.from(data);

    await ctx.reply('Обрабатываю фото...');

    const recognitionResult = await recognitionService.recognizeReading(imageBuffer, counter.type);
    const reading = recognitionResult.value;

    if (!reading) {
      return ctx.reply(
        'Не удалось распознать показания на фото. Пожалуйста, выберите другой способ:',
        readingInputMethodKeyboard
      );
    }

    (ctx.scene.state as SceneState).recognizedReading = reading;
    await ctx.reply(
      `Я распознал показания: ${reading}. Это верно?`,
      confirmReadingKeyboard
    );
  } catch (error) {
    return ctx.reply(
      'Произошла ошибка при обработке фото. Пожалуйста, выберите другой способ:',
      readingInputMethodKeyboard
    );
  }
});

// Экспорт сцены
export default readingInputScene;
