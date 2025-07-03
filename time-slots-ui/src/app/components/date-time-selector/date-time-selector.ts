import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';

@Component({
  selector: 'app-date-time-selector',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatTimepickerModule,
    FormsModule,
  ],
  templateUrl: './date-time-selector.html',
  styleUrl: './date-time-selector.css',
})
export class DateTimeSelector {
  @Input() dateLabel = 'Choose a date';
  @Input() timeLabel = 'Choose a time';
  
  @Input() minDate: Date | undefined;
  @Input() maxDate: Date | undefined;
  @Input() 
  set value(value: Date) {
    this.selectedDatetime = new Date(value);
  }

  get value() {
    return this.selectedDatetime;
  }

  @Output() datetimeValueChange = new EventEmitter<Date>();

  selectedDatetime: Date = new Date(new Date().setMinutes(0));

  get timeValue() {
    return this.selectedDatetime;
  }

  set timeValue(time: Date) {
    this.selectedDatetime.setHours(time.getHours());
    this.selectedDatetime.setMinutes(time.getMinutes());
    this.datetimeValueChange.emit(this.selectedDatetime);
  }

  get dateValue() {
    return this.selectedDatetime;
  }

  set dateValue(date: Date) {
    const hours = this.selectedDatetime.getHours();
    const minutes = this.selectedDatetime.getMinutes();
    this.selectedDatetime = new Date(date);
    this.selectedDatetime.setHours(hours);
    this.selectedDatetime.setMinutes(minutes);
    this.datetimeValueChange.emit(this.selectedDatetime);
  }

  ngOnInit() {
    this.datetimeValueChange.emit(this.selectedDatetime);
  }
}
