import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Room } from '../models/room.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private readonly apiUrl = `${environment.apiUrl}/admin/rooms`;

  constructor(readonly http: HttpClient) {}

  getRooms(): Observable<Room[]> {

    // In development mode, return mock data
    if (!environment.production) {
      console.log('Using mock room data in dev environment');
      return new Observable<Room[]>(observer => {
        observer.next([
          { id: 1, name: 'Main Dining Room', tables: [] },
          { id: 2, name: 'Terrace', tables: [] },
          { id: 3, name: 'Private Room', tables: [] }
        ]);
        observer.complete();
      });
    }

    return this.http.get<Room[]>(this.apiUrl);
  }

  createRoom(roomData: {name: string}): Observable<Room> {

    // In development mode, return mock data
    if (!environment.production) {
      console.log('Using mock room creation in dev environment');
      return new Observable<Room>(observer => {
        observer.next({ id: 4, name: roomData.name, tables: [] });
        observer.complete();
      });
    }

    return this.http.post<Room>(this.apiUrl, roomData);
  }

  updateRoom(id: number, roomData: {name: string}): Observable<Room> {

    // In development mode, return mock data
    if (!environment.production) {
      console.log('Using mock room update in dev environment');
      return new Observable<Room>(observer => {
        observer.next({ id, name: roomData.name, tables: [] });
        observer.complete();
      });
    }

    return this.http.put<Room>(`${this.apiUrl}/${id}`, roomData);
  }

  deleteRoom(id: number): Observable<void> {

    // In development mode, return mock data
    if (!environment.production) {
      console.log('Using mock room deletion in dev environment');
      return new Observable<void>(observer => {
        observer.next();
        observer.complete();
      });
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
