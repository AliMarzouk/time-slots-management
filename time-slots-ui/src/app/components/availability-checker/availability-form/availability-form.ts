import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { DateTimeSelector } from './date-time-selector/date-time-selector';
import { JsonFileReader } from './json-file-reader/json-file-reader';
import { SearchCriteria } from '../../../types/search-criteria.type';
import { TimeSlot } from '../../../types/time-slot.type';

@Component({
  selector: 'app-availability-form',
  standalone: true,
  imports: [
    DateTimeSelector,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    JsonFileReader,
    CommonModule,
    MatCardModule,
    FormsModule,
    MatTableModule,
  ],
  templateUrl: './availability-form.html',
})
export class AvailabilityForm {
  @Output() searchClicked = new EventEmitter<SearchCriteria>();

  startDate: Date = new Date(new Date().setMinutes(0));
  endDate: Date = new Date(new Date().setMinutes(30));
  durationMinutes: number = 30;
  filesData: Record<number, TimeSlot[]> = {};
  fileReaderIds = [1];

  minStartDate = new Date();

  get isSearchDisabled() {
    return !this.startDate || !this.endDate || !this.durationMinutes;
  }

  get busySlots() {
    return Object.keys(this.filesData).flatMap(
      (fileId) => this.filesData[+fileId]
    );
  }

  onStartDateChange(value: Date) {
    this.startDate = value;
    if (this.startDate > this.endDate) {
      const newEndDate = new Date(this.startDate);
      newEndDate.setHours(newEndDate.getHours() + 1);
      this.endDate = newEndDate;
    }
  }

  onEndDateChange(value: Date) {
    this.endDate = value;
  }

  onFileLoaded({ id, data }: { id: number; data: TimeSlot[] }) {
    this.filesData = {
      ...this.filesData,
      [id]: data,
    };
  }

  validateTimeSlotsJSON(json: any) {
    if (!Array.isArray(json)) {
      throw 'Should be an array.';
    }
    const isInvalidDateString = (date: string) =>
      isNaN(new Date(date).getTime());
    json.forEach((slot) => {
      if (isInvalidDateString(slot.start) || isInvalidDateString(slot.end)) {
        throw 'Should contain a valid start date and end date';
      }
      slot.start = new Date(slot.start);
      slot.end = new Date(slot.end);
    });
  }

  onFileReaderAdd() {
    this.fileReaderIds.push(this.fileReaderIds.length + 1);
  }

  onSearchClicked() {
    this.searchClicked.emit({
      durationMinutes: this.durationMinutes,
      startDate: this.startDate,
      endDate: this.endDate,
      busySlots: this.busySlots,
    });
  }
}
