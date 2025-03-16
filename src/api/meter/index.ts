import { ApiError } from '~/utils/errorHandler';
import { apiConfig } from '~/config/apiConfig';
import { IMeter, IMeterInfo, IReading } from './types';

export class Meter {
  private baseUrl = apiConfig.meterApiUrl;

  async ofAccount(accountNumber: string): Promise<IMeter[] | IMeter> {
    try {
      const response = await fetch(`${this.baseUrl}/meters/${accountNumber}`);
      const data = await response.json() as unknown as IMeter ;
      return data;
    } catch (error) {
      throw new ApiError('Не удалось найти лицевой счет', error);
    }
  }

  async info(serialNumber: string): Promise<IMeterInfo> {
    try {
      const response = await fetch(`${this.baseUrl}/meter-info/${serialNumber}`);
      const data = await response.json() as unknown as IMeterInfo;
      return data;
    } catch (error) {
      throw new ApiError('Не удалось получить счетчики', error);
    }
  }

  async submitReading(serialNumber: string, value: number): Promise<IReading | { error: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/submit-reading`, {
        method: 'POST',
        body: JSON.stringify({
          serialNumber,
          newReading: value,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json() as unknown as IReading | { error: string };
      return data;
    } catch (error) {
      throw new ApiError('Не удалось отправить показания', error);
    }
  }
}
