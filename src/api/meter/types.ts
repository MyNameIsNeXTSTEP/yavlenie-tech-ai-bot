export interface IMeter {
  id: number;
  prevReading: number;
  restriction: string | null;
  serialNumber: string;
  type: string;
  lastVerification: string;
  nextVerification: string;
}

export interface IMeterInfo {
  id: number;
  accountNumber: string;
  serialNumber: string;
  type: string; // 'water', 'electricity', 'gas', etc.
  restriction: string | null;
  prevReading: number;
  lastVerification: string;
  nextVerification: string;
}

export interface IReading {
  id: string;
  meterId: string;
  value: number;
  date: string;
  source: string; // 'manual', 'photo', 'api', etc.
  createdAt: string;
}
