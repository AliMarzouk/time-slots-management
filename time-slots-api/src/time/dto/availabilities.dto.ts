import { TimeSlotDto } from './time-slot.dto';

export class AvailabilitiesDto {
  [day: string]: TimeSlotDto[];
}
