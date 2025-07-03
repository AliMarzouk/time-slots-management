import { Component } from '@angular/core';
import { DateTimeSelector } from './components/date-time-selector/date-time-selector';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JsonFileReader } from './components/json-file-reader/json-file-reader';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { TimeService } from './services/time.service';
import { MatTableModule } from '@angular/material/table';
@Component({
  selector: 'app-root',
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
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(private timeService: TimeService) {}

  startDate: Date = new Date(new Date().setMinutes(0));
  endDate: Date = new Date(new Date().setMinutes(30));
  durationMinutes: number = 30;
  filesData: Record<number, any[]> = {};
  fileReaderIds = [1];

  minStartDate = new Date();

  slotTableData: { day: string; slot: string }[] = [];

  displayedColumns: string[] = ['day', 'slot'];

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

  onFileLoaded({ id, data }: { id: number; data: any }) {
    this.filesData = {
      ...this.filesData,
      [id]: data,
    };
    console.log(this.filesData);
  }

  onFileReaderAdd() {
    this.fileReaderIds.push(this.fileReaderIds.length + 1);
  }

  onSearchClicked() {
    console.log(this.startDate.getTime());
    console.log(this.endDate);
    console.log(this.busySlots);
    console.log(this.durationMinutes);
    this.timeService
      .getAvailabilities(
        this.durationMinutes,
        this.startDate,
        this.endDate,
        this.busySlots
      )
      .subscribe((data: any) => {
        this.slotTableData = Object.keys(data).flatMap((day: string) =>
          data[day]?.map((slot: any) => ({
            day,
            slot: this.formatTimeSlot(new Date(slot.start), new Date(slot.end)),
          }))
        );
        console.log(this.slotTableData);
        console.log(this.slotTableData.length > 0);
      });
  }

  formatTimeSlot(startDate: Date, endDate: Date) {
    return `${startDate.getHours().toString().padStart(2, '0')}:${startDate
      .getMinutes()
      .toString()
      .padStart(2, '0')} - ${endDate
      .getHours()
      .toString()
      .padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  }
}
