import { IMeter, IMeterInfo } from "~/api/meter/types";
import { RecognitionResult } from "~/api/recognition/types";

export interface ISceneSessionState {
  meters?: IMeter[];
  meterInfo?: IMeterInfo;
  selectedMeter?: IMeter;
  recognizedReading?: RecognitionResult;
};
