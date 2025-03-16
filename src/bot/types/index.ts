import { IMeter, IMeterInfo } from "~/api/meter/types";

export interface ISceneSessionState {
  state: {
    meters?: IMeter[];
    meterInfo?: IMeterInfo;
    selectedMeter?: IMeter;
    recognizedReading?: number;
  }
};
