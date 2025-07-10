export type TableStatus = 'available' | 'reserved' | 'occupied';

export interface Table {
  id: number;
  name: string;
  seats: number;
  status: TableStatus;
}
