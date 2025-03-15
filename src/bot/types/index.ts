import { IAccount, IMeter } from "~/api/meter/types";

export interface SceneState {
  account?: IAccount;
  meters?: IMeter[];
  selectedMeter?: any;
  recognizedReading?: number;
};
