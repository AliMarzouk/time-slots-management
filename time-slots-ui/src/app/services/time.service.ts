import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';

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
  ) {
    const url = `${this.baseUrl}/time`;
    return this.httpClient.post(url, {
      durationMinutes,
      startDate,
      endDate,
      busySlots,
    });
  }
}
