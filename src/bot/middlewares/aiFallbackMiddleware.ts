import { Middleware } from 'telegraf';
import { OpenAIService } from '~/api/ai/openaiService';
import { MyContext } from '..';

export function createAiFallbackMiddleware(openAIService: OpenAIService): Middleware<MyContext> {
  return async (ctx, next) => {
    await next();
    if (ctx.message && 'text' in ctx.message && !['/start', '/account', '/readings', '/help'].includes(ctx.message.text)) {
      const text = ctx.message.text;
      const aiResponse = await openAIService.processUserQuery(text);
      return await ctx.reply(aiResponse);
    }
  };
}
