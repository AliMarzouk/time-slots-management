import { IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class TimeSlotDto {
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start: Date;
  @Transform(({ value }) => new Date(value))
  @IsDate()
  end: Date;
}
