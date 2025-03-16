import { Scenes } from 'telegraf';
import { MyContext } from '~/bot';

export class DialogManager {
  static async resetDialog(ctx: MyContext): Promise<void> {
    await ctx.scene.leave();
    ctx.session.state = {};
  }
  
  static async startReadingFlow(ctx: MyContext): Promise<void> {
    // Если у пользователя уже есть сохраненный аккаунт, переходим к выбору счетчика
    if (ctx.session.state.selectedMeter) {
      return ctx.scene.enter('meter_selection');
    }
    
    // Иначе начинаем с идентификации
    return ctx.scene.enter('identification');
  }
}
