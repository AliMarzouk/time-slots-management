import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { AvailabilityForm } from './availability-form/availability-form';
import { SearchCriteria } from '../../types/search-criteria.type';
import { TimeService } from '../../services/time.service';
import { AvailabilityTable } from './availability-table/availability-table';
import { Availabilities } from '../../types/availabilities.type';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-availability-checker',
  imports: [
    MatTableModule,
    AvailabilityForm,
    AvailabilityTable,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './availability-checker.html',
  styleUrls: ['./availability-checker.css'],
})
export class AvailabilityChecker {
  constructor(private timeService: TimeService) {}

  availabilities: Availabilities = {};
  searched = false;
  loading = false;

  get emptyAvailabilities() {
    return (
      !this.availabilities || Object.keys(this.availabilities).length === 0
    );
  }

  onSearchClicked(searchCriteria: SearchCriteria) {
    this.searched = false;
    this.loading = true;
    this.timeService
      .getAvailabilities(
        searchCriteria.durationMinutes,
        searchCriteria.startDate,
        searchCriteria.endDate,
        searchCriteria.busySlots
      )
      .subscribe((data: Availabilities) => {
        this.availabilities = data;
        this.searched = true;
        this.loading = false;
      });
  }
}
