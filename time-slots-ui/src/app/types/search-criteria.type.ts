import { TimeSlot } from "./time-slot.type";

export type SearchCriteria = {
  durationMinutes: number;
  startDate: Date;
  endDate: Date;
  busySlots: TimeSlot[];
};
