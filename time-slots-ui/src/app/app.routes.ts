import { Routes } from '@angular/router';
import { AvailabilityChecker } from './components/availability-checker/availability-checker';

export const routes: Routes = [
  {
    path: 'availability-checker',
    component: AvailabilityChecker,
    title: 'Time slots checker',
  },
  { path: '**', redirectTo: 'availability-checker', pathMatch: 'full' },
];
