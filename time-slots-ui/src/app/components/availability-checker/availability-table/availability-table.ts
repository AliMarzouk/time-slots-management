import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Availabilities } from '../../../types/availabilities.type';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatChipsModule} from '@angular/material/chips';

@Component({
  selector: 'app-availability-table',
  imports: [MatTableModule, MatExpansionModule, MatChipsModule],
  templateUrl: './availability-table.html',
})
export class AvailabilityTable {
  @Input()
  set availabilities(data: Availabilities) {
    this._availabilities = data;
    this.tableDataByDay = {};

    Object.keys(data).forEach((day) => {
      this.tableDataByDay[day] = data[day].map((slot) =>
        this.formatTimeSlot(slot.start, slot.end)
      );
    });
  }

  get availabilities() {
    return this._availabilities;
  }

  get tableDays() {
    return Object.keys(this.tableDataByDay);
  }

  _availabilities: Availabilities = {};

  tableDataByDay: Record<string, string[]> = {};

  displayedColumns: string[] = ['day', 'slot'];

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
