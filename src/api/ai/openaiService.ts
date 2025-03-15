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

      return response.choices[0].message.content || 'Извините, я не смог обработать ваш запрос.';
    } catch (error) {
      logger.error('Ошибка при обработке запроса в OpenAI', error);
      return 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.';
    }
  }
}
