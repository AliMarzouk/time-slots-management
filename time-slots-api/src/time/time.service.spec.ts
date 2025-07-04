import { Test, TestingModule } from '@nestjs/testing';
import { TimeService } from './time.service';
import { TimeSlot } from './type/slot.type';

describe('TimeService', () => {
  let timeService: TimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeService],
    }).compile();

    timeService = module.get<TimeService>(TimeService);
  });

  it('should be defined', () => {
    expect(timeService).toBeDefined();
  });

  describe('mergeSlots', () => {
    it('should merge overlapping time slots', () => {
      // Given
      const overlappingTimeSlots: TimeSlot[] = [
        {
          start: new Date('2022-08-01T09:00:00'),
          end: new Date('2022-08-01T12:00:00'),
        },
        {
          start: new Date('2022-08-01T10:00:00'),
          end: new Date('2022-08-01T15:00:00'),
        },
        {
          start: new Date('2025-05-05T10:00:00'),
          end: new Date('2025-05-05T18:00:00'),
        },
        {
          start: new Date('2025-05-05T12:00:00'),
          end: new Date('2025-05-05T14:00:00'),
        },
      ];
      const expectedSlots = [
        {
          start: new Date('2022-08-01T09:00:00'),
          end: new Date('2022-08-01T15:00:00'),
        },
        {
          start: new Date('2025-05-05T10:00:00'),
          end: new Date('2025-05-05T18:00:00'),
        },
      ];

      // When
      const mergedSlots = timeService['mergeSlots'](overlappingTimeSlots);

      // Then
      expect(mergedSlots).toEqual(expectedSlots);
    });

    it('should not modify non overlapping time slots', () => {
      // Given
      const overlappingTimeSlots: TimeSlot[] = [
        {
          start: new Date('2022-08-01T09:00:00'),
          end: new Date('2022-08-01T12:00:00'),
        },
        {
          start: new Date('2022-08-02T10:00:00'),
          end: new Date('2022-08-02T15:00:00'),
        },
        {
          start: new Date('2025-05-05T10:00:00'),
          end: new Date('2025-05-05T18:00:00'),
        },
        {
          start: new Date('2025-05-06T12:00:00'),
          end: new Date('2025-05-06T14:00:00'),
        },
      ];
      const expectedSlots = overlappingTimeSlots;

      // When
      const mergedSlots = timeService['mergeSlots'](overlappingTimeSlots);

      // Then
      expect(mergedSlots).toEqual(expectedSlots);
    });
  });

  describe('getTimeSlotsByDate', () => {
    it('should map time slots by date', () => {
      // Given
      const timeSlots: TimeSlot[] = [
        {
          start: new Date('2025-05-06T12:00:00'),
          end: new Date('2025-05-06T14:00:00'),
        },
        {
          start: new Date('2025-05-07T10:00:00'),
          end: new Date('2025-05-07T18:00:00'),
        },
        {
          start: new Date('2025-05-06T09:00:00'),
          end: new Date('2025-05-06T10:00:00'),
        },
      ];

      const expectedMap = {
        [new Date('2025-05-06').toDateString()]: [
          {
            start: new Date('2025-05-06T12:00:00'),
            end: new Date('2025-05-06T14:00:00'),
          },
          {
            start: new Date('2025-05-06T09:00:00'),
            end: new Date('2025-05-06T10:00:00'),
          },
        ],
        [new Date('2025-05-07').toDateString()]: [
          {
            start: new Date('2025-05-07T10:00:00'),
            end: new Date('2025-05-07T18:00:00'),
          },
        ],
      };

      // When
      const timeSlotsByDate = timeService['getTimeSlotsByDate'](timeSlots);

      // Then
      expect(timeSlotsByDate).toEqual(expectedMap);
    });
  });

  describe('calculateAvailableSlotsGivenBusySlot', () => {
    const TestCases = [
      [
        [
          [
            {
              start: new Date('2025-05-07T09:00:00'),
              end: new Date('2025-05-07T12:00:00'),
            },
            {
              start: new Date('2025-05-07T15:00:00'),
              end: new Date('2025-05-07T18:00:00'),
            },
          ],
          {
            start: new Date('2025-05-07T10:00:00'),
            end: new Date('2025-05-07T17:00:00'),
          },
        ],
        [
          {
            start: new Date('2025-05-07T09:00:00'),
            end: new Date('2025-05-07T10:00:00'),
          },
          {
            start: new Date('2025-05-07T17:00:00'),
            end: new Date('2025-05-07T18:00:00'),
          },
        ],
      ],
      [
        [
          [
            {
              start: new Date('2025-05-07T09:00:00'),
              end: new Date('2025-05-07T13:00:00'),
            },
          ],
          {
            start: new Date('2025-05-07T09:00:00'),
            end: new Date('2025-05-07T11:00:00'),
          },
        ],
        [
          {
            start: new Date('2025-05-07T11:00:00'),
            end: new Date('2025-05-07T13:00:00'),
          },
        ],
      ],
      [
        [
          [
            {
              start: new Date('2025-05-07T10:00:00'),
              end: new Date('2025-05-07T15:00:00'),
            },
          ],
          {
            start: new Date('2025-05-07T12:00:00'),
            end: new Date('2025-05-07T15:00:00'),
          },
        ],
        [
          {
            start: new Date('2025-05-07T10:00:00'),
            end: new Date('2025-05-07T12:00:00'),
          },
        ],
      ],

      [
        [
          [
            {
              start: new Date('2025-05-07T09:00:00'),
              end: new Date('2025-05-07T18:00:00'),
            },
          ],
          {
            start: new Date('2025-05-07T12:00:00'),
            end: new Date('2025-05-07T15:00:00'),
          },
        ],
        [
          {
            start: new Date('2025-05-07T09:00:00'),
            end: new Date('2025-05-07T12:00:00'),
          },
          {
            start: new Date('2025-05-07T15:00:00'),
            end: new Date('2025-05-07T18:00:00'),
          },
        ],
      ],
    ];

    test.each(TestCases)(
      'should remove busy slot from free slots given overlapping busy slots',
      ([freeSlots, busySlot]: [TimeSlot[], TimeSlot], expectedMap) => {
        // When
        const resultFreeSlots = timeService[
          'calculateAvailableSlotsGivenBusySlot'
        ](freeSlots, busySlot);

        // Then
        expect(resultFreeSlots).toEqual(expectedMap);
      },
    );
  });

  describe('findAvailabilities', () => {
    it('should find all free time slots given time period and busy time slots', () => {
      // Given
      const durationMinutes = 60;
      const startPeriod = new Date('2025-05-07T01:00:00');
      const endPeriod = new Date('2025-05-08T12:00:00');
      const busySlots = [
        {
          start: new Date('2025-05-07T10:00:00'),
          end: new Date('2025-05-07T11:00:00'),
        },
        {
          start: new Date('2025-05-07T13:00:00'),
          end: new Date('2025-05-07T15:00:00'),
        },
        {
          start: new Date('2025-05-07T14:00:00'),
          end: new Date('2025-05-07T20:00:00'),
        },
        {
          start: new Date('2025-05-08T09:15:00'),
          end: new Date('2025-05-08T15:00:00'),
        },
      ];

      // When
      const availabilities = timeService.findAvailabilities(
        startPeriod,
        endPeriod,
        durationMinutes,
        busySlots,
      );

      // Then
      const expectedAvailabilities: Record<string, TimeSlot[]> = {
        [new Date('2025-05-07').toDateString()]: [
          {
            start: new Date('2025-05-07T09:00:00'),
            end: new Date('2025-05-07T10:00:00'),
          },
          {
            start: new Date('2025-05-07T11:00:00'),
            end: new Date('2025-05-07T12:00:00'),
          },
          {
            start: new Date('2025-05-07T12:00:00'),
            end: new Date('2025-05-07T13:00:00'),
          },
        ],
        [new Date('2025-05-08').toDateString()]: [],
      };

      expect(availabilities).toEqual(expectedAvailabilities);
    });
  });
});
