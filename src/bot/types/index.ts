import { Scenes } from "telegraf";
import { IMeter, IMeterInfo } from "~/api/meter/types";

export interface ISceneSessionState {
  meters?: IMeter[];
  meterInfo?: IMeterInfo;
  selectedMeter?: IMeter;
  recognizedReading?: number;
};
