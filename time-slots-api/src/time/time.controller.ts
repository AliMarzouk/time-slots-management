import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { TimeService } from './time.service';
import { calculateAvailabilitiesDto } from './dto/calculate-availabilities.dto';
import { AvailabilitiesDto } from './dto/availabilities.dto';

@Controller('time')
export class TimeController {
  constructor(private readonly timeService: TimeService) {}

  @Post()
  calculateAvailability(
    @Body() payload: calculateAvailabilitiesDto,
  ): AvailabilitiesDto {
    if (payload.endDate < payload.startDate) {
      throw new BadRequestException(
        'start date should be less than the end date',
      );
    }
    return this.timeService.findAvailabilities(
      payload.startDate,
      payload.endDate,
      payload.durationMinutes,
      payload.busySlots,
    );
  }
}
