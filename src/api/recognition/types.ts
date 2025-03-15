export interface RecognitionResult {
  value: number;
  confidence: number;
  counterType: string;
  metadata?: {
    originalValue?: string;
    processingTime?: number;
  };
}
