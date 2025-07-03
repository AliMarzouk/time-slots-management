import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { TimeSlot } from '../type/slot.type';
import { Transform, Type } from 'class-transformer';
import { TimeSlotDto } from './time-slot.dto';

export class calculateAvailabilitiesDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  durationMinutes: number;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  startDate: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  endDate: Date;

  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  busySlots: TimeSlot[];
}
