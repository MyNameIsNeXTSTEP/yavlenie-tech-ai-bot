import { Scenes } from 'telegraf';

export class DialogManager {
  static async resetDialog(ctx: Scenes.SceneContext): Promise<void> {
    await ctx.scene.leave();
    ctx.scene.state = {};
  }
  
  static async startReadingFlow(ctx: Scenes.SceneContext): Promise<void> {
    // Если у пользователя уже есть сохраненный аккаунт, переходим к выбору счетчика
    if (ctx.scene.state.account) {
      return ctx.scene.enter('counter_selection');
    }
    
    // Иначе начинаем с идентификации
    return ctx.scene.enter('identification');
  }
}
