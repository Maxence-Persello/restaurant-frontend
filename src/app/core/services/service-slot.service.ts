import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ServiceSlot } from '../models/service-slot.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceSlotService {

  private readonly apiUrl = `${environment.apiUrl}/admin/services`;

  constructor(readonly http: HttpClient) {}

  getServices(): Observable<ServiceSlot[]> {
    // In development mode, return mock data
    if (!environment.production) {
      console.log('Using mock service data in dev environment');
      return new Observable<ServiceSlot[]>(observer => {
        observer.next([
          { 
            id: 1, 
            dayOfWeek: 1, 
            name: 'Midi', 
            startTime: '12:00', 
            endTime: '14:00' 
          },
          { 
            id: 2, 
            dayOfWeek: 1, 
            name: 'Soir', 
            startTime: '19:00', 
            endTime: '22:00' 
          },
          { 
            id: 3, 
            dayOfWeek: 2, 
            name: 'Midi', 
            startTime: '12:00', 
            endTime: '14:00' 
          },
          { 
            id: 4, 
            dayOfWeek: 5, 
            name: 'Soir', 
            startTime: '19:00', 
            endTime: '23:00' 
          },
          { 
            id: 5, 
            dayOfWeek: 6, 
            name: 'Midi', 
            startTime: '12:00', 
            endTime: '15:00' 
          },
          { 
            id: 6, 
            dayOfWeek: 6, 
            name: 'Soir', 
            startTime: '19:00', 
            endTime: '23:30' 
          }
        ]);
        observer.complete();
      });
    }

    return this.http.get<ServiceSlot[]>(this.apiUrl);
  }

  getService(id: number): Observable<ServiceSlot> {
    // In development mode, return mock data
    if (!environment.production) {
      console.log('Using mock service data in dev environment');
      return new Observable<ServiceSlot>(observer => {
        observer.next({ 
          id, 
          dayOfWeek: 1, 
          name: 'Midi', 
          startTime: '12:00', 
          endTime: '14:00' 
        });
        observer.complete();
      });
    }

    return this.http.get<ServiceSlot>(`${this.apiUrl}/${id}`);
  }

  createService(serviceData: Omit<ServiceSlot, 'id'>): Observable<ServiceSlot> {
    // In development mode, return mock data
    if (!environment.production) {
      console.log('Using mock service creation in dev environment');
      return new Observable<ServiceSlot>(observer => {
        observer.next({ 
          id: Math.floor(Math.random() * 1000), 
          ...serviceData 
        });
        observer.complete();
      });
    }

    return this.http.post<ServiceSlot>(this.apiUrl, serviceData);
  }

  updateService(id: number, serviceData: Omit<ServiceSlot, 'id'>): Observable<ServiceSlot> {
    // In development mode, return mock data
    if (!environment.production) {
      console.log('Using mock service update in dev environment');
      return new Observable<ServiceSlot>(observer => {
        observer.next({ id, ...serviceData });
        observer.complete();
      });
    }

    return this.http.put<ServiceSlot>(`${this.apiUrl}/${id}`, serviceData);
  }

  deleteService(id: number): Observable<void> {
    // In development mode, return mock data
    if (!environment.production) {
      console.log('Using mock service deletion in dev environment');
      return new Observable<void>(observer => {
        observer.next();
        observer.complete();
      });
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
