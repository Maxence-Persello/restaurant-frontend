import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Table } from '../models/table.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private readonly apiUrl = `${environment.apiUrl}/admin/tables`;

  constructor(readonly http: HttpClient) {}

  getTablesForRoom(roomId: number): Observable<Table[]> {

    // In development mode, return mock data
    if (!environment.production) {
      console.log('Using mock table retrieval in dev environment');
      return new Observable<Table[]>(observer => {
        observer.next([
          { id: 1, name: 'getTablesForRoom 1', seats: 4},
          { id: 2, name: 'getTablesForRoom 2', seats: 2}
        ]);
        observer.complete();
      });
    }

    return this.http.get<Table[]>(`${this.apiUrl}/${roomId}`);
  }

  createTable(tableData: {name: string, seats: number, roomId: number}): Observable<Table> {

    // In development mode, return mock data
    if (!environment.production) {
      console.log('Using mock table creation in dev environment');
      return new Observable<Table>(observer => {
        observer.next({ id: 3, name: tableData.name, seats: tableData.seats });
        observer.complete();
      });
    }

    return this.http.post<Table>(this.apiUrl, tableData);
  }

  updateTable(id: number, tableData: {name: string, seats: number}): Observable<Table> {

    // In development mode, return mock data
    if (!environment.production) {
      console.log('Using mock table update in dev environment');
      return new Observable<Table>(observer => {
        observer.next({ id, name: tableData.name, seats: tableData.seats });
        observer.complete();
      });
    }

    return this.http.put<Table>(`${this.apiUrl}/${id}`, tableData);
  }

  deleteTable(id: number): Observable<void> {

    // In development mode, return mock data
    if (!environment.production) {
      console.log('Using mock table deletion in dev environment');
      return new Observable<void>(observer => {
        observer.next();
        observer.complete();
      });
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
