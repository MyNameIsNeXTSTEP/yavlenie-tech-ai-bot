import { Markup } from 'telegraf';
import { IMeter } from '~/api/meter/types';

// Клавиатура для подтверждения показаний
export const confirmReadingKeyboard = Markup.inlineKeyboard([
  Markup.button.callback('✅ Да, верно', 'confirm_reading'),
  Markup.button.callback('❌ Нет, ввести заново', 'reject_reading')
]);

// Клавиатура для выбора способа ввода показаний
export const readingInputMethodKeyboard = Markup.inlineKeyboard([
  Markup.button.callback('📷 Отправить фото', 'send_photo'),
  Markup.button.callback('🔢 Ввести вручную', 'manual_input')
]);

// Клавиатура для финальной сцены
export const finalSceneKeyboard = Markup.inlineKeyboard([
  Markup.button.callback('✅ Да, еще счетчик', 'another_meter'),
  Markup.button.callback('❌ Нет, завершить', 'finish')
]);

// Клавиатура для выбора счетчика
export function useMeterSelectionKeyboard(meters: IMeter[]) {
  return Markup.inlineKeyboard(
    meters.map((meter: IMeter, index: number) => 
      Markup.button.callback(
        `${meter.type} (${meter.serialNumber})`, 
        `select_meter_${index}`
      )
    ),
    { columns: 1 }
  );
}