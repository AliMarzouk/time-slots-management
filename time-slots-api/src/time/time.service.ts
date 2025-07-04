import { Injectable } from '@nestjs/common';
import { TimeSlot } from './type/slot.type';

const WORKDAY_START_HOUR = 9;
const WORKDAY_END_HOUR = 18;

@Injectable()
export class TimeService {
  /** */
  findAvailabilities(
    searchPeriodStart: Date,
    searchPeriodEnd: Date,
    slotDurationMinutes: number,
    busySlots: TimeSlot[],
  ): Record<string, TimeSlot[]> {
    const workDaysSlots: TimeSlot[] = this.splitIntoWorkdaySlots(
      searchPeriodStart,
      searchPeriodEnd,
    );
    const freeSlots: Record<string, TimeSlot[]> =
      this.calculateAvailabilitiesFromBusySlots(workDaysSlots, busySlots);
    Object.keys(freeSlots).forEach((date) => {
      freeSlots[date] = this.divideTimeSlotsByDuration(
        freeSlots[date],
        slotDurationMinutes,
      );
    });
    return freeSlots;
  }

  private splitIntoWorkdaySlots(startDate: Date, endDate: Date): TimeSlot[] {
    const slots: TimeSlot[] = [];

    const workPeriodStart = new Date(startDate);
    const workPeriodEnd = new Date(endDate);
    if (workPeriodStart.getHours() < WORKDAY_START_HOUR) {
      workPeriodStart.setHours(WORKDAY_START_HOUR, 0, 0, 0);
    }
    if (workPeriodStart.getHours() >= WORKDAY_END_HOUR) {
      workPeriodStart.setDate(workPeriodStart.getDate() + 1);
      workPeriodStart.setHours(WORKDAY_START_HOUR, 0, 0, 0);
    }
    if (workPeriodEnd.getHours() < WORKDAY_START_HOUR) {
      workPeriodEnd.setDate(workPeriodEnd.getDate() - 1);
      workPeriodEnd.setHours(WORKDAY_END_HOUR, 0, 0, 0);
    }
    if (workPeriodEnd.getHours() >= WORKDAY_END_HOUR) {
      workPeriodEnd.setHours(WORKDAY_END_HOUR, 0, 0, 0);
    }

    const current = new Date(workPeriodStart);

    while (current < workPeriodEnd) {
      const workStart = new Date(current);

      const workEnd = new Date(current);
      workEnd.setHours(WORKDAY_END_HOUR, 0, 0, 0);

      const slotEnd = new Date(Math.min(workEnd.getTime(), endDate.getTime()));

      slots.push({ start: workStart, end: slotEnd });

      current.setDate(current.getDate() + 1);
      current.setHours(WORKDAY_START_HOUR, 0, 0, 0);
    }

    return slots;
  }

  private divideTimeSlotsByDuration(
    slots: TimeSlot[],
    DurationInMinutes: number,
  ): TimeSlot[] {
    const timeSlots = this.mergeSlots(slots);
    return timeSlots.flatMap((slot) =>
      this.divideTimeSlotByDuration(slot, DurationInMinutes),
    );
  }

  private divideTimeSlotByDuration(
    slot: TimeSlot,
    DurationInMinutes: number,
  ): TimeSlot[] {
    const MS_IN_MINUTE = 60000;
    const decimalNumberSlots =
      (slot.end.getTime() - slot.start.getTime()) /
      (DurationInMinutes * MS_IN_MINUTE);
    const integerNumberSlots = Math.floor(decimalNumberSlots);
    const slots = [...Array(integerNumberSlots).keys()].map((index) => ({
      start: new Date(
        slot.start.getTime() + index * DurationInMinutes * MS_IN_MINUTE,
      ),
      end: new Date(
        slot.start.getTime() + (index + 1) * DurationInMinutes * MS_IN_MINUTE,
      ),
    }));

    if (decimalNumberSlots !== integerNumberSlots && integerNumberSlots !== 0) {
      slots.push({
        start: new Date(slot.end.getTime() - DurationInMinutes * MS_IN_MINUTE),
        end: slot.end,
      });
    }
    return slots;
  }

  private calculateAvailabilitiesFromBusySlots(
    freeSlots: TimeSlot[],
    busySlots: TimeSlot[],
  ): Record<string, TimeSlot[]> {
    const mergedBusySlots = this.mergeSlots(busySlots);
    const busySlotsByDate = this.getTimeSlotsByDate(mergedBusySlots);
    const freeSlotsByDate = this.getTimeSlotsByDate(freeSlots);
    const resultFreeSlots: Record<string, TimeSlot[]> = {};
    for (const date in freeSlotsByDate) {
      resultFreeSlots[date] = freeSlotsByDate[date];
      for (const busySlot of busySlotsByDate[date] || []) {
        resultFreeSlots[date] = this.calculateAvailableSlotsGivenBusySlot(
          resultFreeSlots[date],
          busySlot,
        );
      }
    }
    return resultFreeSlots;
  }

  private calculateAvailableSlotsGivenBusySlot(
    freeSlots: TimeSlot[],
    busySlot: TimeSlot,
  ): TimeSlot[] {
    const newAvailabilities: TimeSlot[] = [];

    for (const slot of freeSlots) {
      const freeStartTime = slot.start.getTime();
      const freeEndTime = slot.end.getTime();
      const busyStartTime = busySlot.start.getTime();
      const busyEndTime = busySlot.end.getTime();

      if (freeEndTime <= busyStartTime || freeStartTime >= busyEndTime) {
        newAvailabilities.push(slot);
        continue;
      }

      if (busyStartTime <= freeStartTime && busyEndTime >= freeEndTime) {
        continue;
      }

      if (busyStartTime > freeStartTime && busyEndTime < freeEndTime) {
        newAvailabilities.push({ start: slot.start, end: busySlot.start });
        newAvailabilities.push({ start: busySlot.end, end: slot.end });
        continue;
      }

      if (busyStartTime <= freeStartTime && busyEndTime < freeEndTime) {
        newAvailabilities.push({ start: busySlot.end, end: slot.end });
        continue;
      }

      if (busyStartTime > freeStartTime && busyEndTime >= freeEndTime) {
        newAvailabilities.push({ start: slot.start, end: busySlot.start });
        continue;
      }
    }

    return newAvailabilities;
  }

  private getTimeSlotsByDate(
    timeSlots: TimeSlot[],
  ): Record<string, TimeSlot[]> {
    const timeSlotsByDate: Record<string, TimeSlot[]> = {};
    for (const timeSlot of timeSlots) {
      if (!timeSlotsByDate[timeSlot.start.toDateString()]) {
        timeSlotsByDate[timeSlot.start.toDateString()] = [];
      }
      timeSlotsByDate[timeSlot.start.toDateString()].push(timeSlot);
    }
    return timeSlotsByDate;
  }

  private mergeSlots(timeSlots: TimeSlot[]): TimeSlot[] {
    const sortedTimeSlots = timeSlots.toSorted(
      (a, b) => a.start.getTime() - b.start.getTime(),
    );
    if (sortedTimeSlots.length === 0) return [];

    const mergedSlots = [sortedTimeSlots[0]];

    for (let i = 1; i < sortedTimeSlots.length; i++) {
      const last = mergedSlots[mergedSlots.length - 1];
      const current = sortedTimeSlots[i];

      if (current.start <= last.end) {
        last.end = new Date(
          Math.max(last.end.getTime(), current.end.getTime()),
        );
      } else {
        mergedSlots.push(current);
      }
    }

    return mergedSlots;
  }
}
