import { ApiError } from '~/utils/errorHandler';
import { apiConfig } from '~/config/apiConfig';
import { Account, Counter, Reading } from './types';

export class CounterService {
  private baseUrl = apiConfig.counterApiUrl;

  async getAccountByNumber(accountNumber: string): Promise<Account> {
    try {
      const response = await fetch(`${this.baseUrl}/accounts/${accountNumber}`);
      const data = await response.json() as unknown as Account ;
      return data;
    } catch (error) {
      throw new ApiError('Не удалось найти лицевой счет', error);
    }
  }

  async getCountersByAccount(accountId: string): Promise<Counter[]> {
    try {
      const response = await fetch(`${this.baseUrl}/accounts/${accountId}/counters`);
      const data = await response.json() as unknown as Counter[] ;
      return data;
    } catch (error) {
      throw new ApiError('Не удалось получить счетчики', error);
    }
  }

  async submitReading(counterId: string, value: number): Promise<Reading> {
    try {
      const response = await fetch(`${this.baseUrl}/counters/${counterId}/readings`, {
        method: 'POST',
        body: JSON.stringify(value),
      });
      const data = await response.json() as unknown as Reading ;
      return data;
    } catch (error) {
      throw new ApiError('Не удалось отправить показания', error);
    }
  }
}
