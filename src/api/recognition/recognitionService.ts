import FormData from 'form-data';
import { ApiError } from '~/utils/errorHandler';
import { apiConfig } from '~//config/apiConfig';
import { RecognitionResult } from './types';

export class RecognitionService {
  private baseUrl = apiConfig.recognitionApiUrl;

  async recognizeReading(imageBuffer: Buffer, type: string): Promise<RecognitionResult> {
    try {
      const formData = new FormData();
      formData.append('image', imageBuffer, { filename: 'meter.jpg' });
      formData.append('type', type);
      const response = await fetch(`${this.baseUrl}/recognize`, {
        method: 'POST',
        body: formData,
        headers: {
          'Api-Key': apiConfig.recognitionApiKey,
          ...formData.getHeaders()
        }
      });
      const data = await response.json() as unknown as RecognitionResult;
      return data;
    } catch (error) {
      throw new ApiError('Не удалось распознать показания', error);
    }
  }
}