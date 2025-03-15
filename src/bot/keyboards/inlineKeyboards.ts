import { Markup } from 'telegraf';

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
  Markup.button.callback('✅ Да, еще счетчик', 'another_counter'),
  Markup.button.callback('❌ Нет, завершить', 'finish')
]);

// Клавиатура для выбора счетчика
export function createCounterSelectionKeyboard(counters) {
  return Markup.inlineKeyboard(
    counters.map((counter, index) => 
      Markup.button.callback(
        `${counter.type} (${counter.number})`, 
        `select_counter_${index}`
      )
    ),
    { columns: 1 }
  );
}