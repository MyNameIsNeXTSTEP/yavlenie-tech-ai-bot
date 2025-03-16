import { ApiError } from '~/utils/errorHandler';
import { apiConfig } from '~/config/apiConfig';
import { IMeter, IMeterInfo, IReading } from './types';

export class Meter {
  private baseUrl = apiConfig.meterApiUrl;

  async ofAccount(accountNumber: string): Promise<IMeter[] | IMeter> {
    try {
      const response = await fetch(`${this.baseUrl}/meters/${accountNumber}`);
      const data = await response.json() as unknown as IMeter ;
      console.info(data, '\nMETERS RESPONSE');
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

  async submitReading(meterId: string, value: number): Promise<IReading> {
    try {
      const response = await fetch(`${this.baseUrl}/meters/${meterId}/readings`, {
        method: 'POST',
        body: JSON.stringify(value),
      });
      const data = await response.json() as unknown as IReading ;
      return data;
    } catch (error) {
      throw new ApiError('Не удалось отправить показания', error);
    }
  }
}
