import OpenAI from 'openai';
import { aiPrompts } from './prompts';

const logger = console;

export class OpenAIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async processUserQuery(userMessage: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: aiPrompts.systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      const errorResponseText = 'Извините, я не смог обработать ваш запрос.';

      if (!response.choices[0]) return errorResponseText;
      return response.choices[0].message.content || errorResponseText;
    } catch (error) {
      logger.error('Ошибка при обработке запроса в OpenAI', error);
      return 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.';
    }
  }
}
