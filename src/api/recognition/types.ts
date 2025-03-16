export interface RecognitionResult {
  value: number;
  confidence: number;
  type: string;
  metadata?: {
    originalValue?: string;
    processingTime?: number;
  };
}
