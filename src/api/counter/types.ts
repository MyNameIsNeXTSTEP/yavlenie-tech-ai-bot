export interface Account {
  id: string;
  number: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Counter {
  id: string;
  accountId: string;
  number: string;
  type: string; // 'water', 'electricity', 'gas', etc.
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reading {
  id: string;
  counterId: string;
  value: number;
  date: string;
  source: string; // 'manual', 'photo', 'api', etc.
  createdAt: string;
}
