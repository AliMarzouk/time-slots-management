import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { TimeSlot } from '../types/time-slot.type';
import { map, Observable } from 'rxjs';
import { Availabilities } from '../types/availabilities.type';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  constructor(private httpClient: HttpClient) {}

  baseUrl = environment.apiBaseUrl;

  getAvailabilities(
    durationMinutes: number,
    startDate: Date,
    endDate: Date,
    busySlots: TimeSlot[]
  ): Observable<Availabilities> {
    const url = `${this.baseUrl}/time`;
    return this.httpClient
      .post<any>(url, {
        durationMinutes,
        startDate,
        endDate,
        busySlots,
      })
      .pipe(
        map((response) => {
          const newResponse: Availabilities = {};
          Object.keys(response).forEach((day) => {
            newResponse[day] = response[day].map((slot: TimeSlot) => ({
              start: new Date(slot.start),
              end: new Date(slot.end),
            }));
          });
          return newResponse;
        })
      );
  }
}
