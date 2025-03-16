// import FormData from 'form-data';
import { ApiError } from '~/utils/errorHandler';
import { apiConfig } from '~//config/apiConfig';
import { RecognitionResult } from './types';

export class RecognitionService {
  private baseUrl = apiConfig.recognitionApiUrl;

  async recognizeReading(imageBuffer: Buffer, type: string): Promise<RecognitionResult> {
    try {
      const formData = new FormData();
      const blob = new Blob([ imageBuffer ]);
      formData.append('image', blob, 'meter.jpg');
      // formData.append('image', imageBuffer, 'meter.jpg');
      formData.append('counter_type', type);
      const response = await fetch(`${this.baseUrl}/recognize`, {
        method: 'POST',
        body: formData,
        headers: {
          'Api-Key': apiConfig.recognitionApiKey,
        }
      });
      const data = await response.json() as unknown as RecognitionResult;
      return data;
    } catch (error) {
      throw new ApiError('Не удалось распознать показания', error);
    }
  }
}