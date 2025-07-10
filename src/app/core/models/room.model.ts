import { Table } from "./table.model";


export interface Room {
  id: number;
  name: string;
  tables?: Table[];
}
