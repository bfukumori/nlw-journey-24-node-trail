import { TripNotFound } from '@/errors/TripNotFound.js';
import { GetActivitiesDTOGroupedByDate } from '@/repositories/dtos/getActivitiesDTO.js';
import { IActivityRepository } from '@/repositories/interfaces/IActivityRepository.js';
import { ITripRepository } from '@/repositories/interfaces/ITripRepository.js';
import { dayjs } from '@/lib/dayjs.js';

export class GetActivitiesUseCase {
  constructor(
    private readonly tripRepository: ITripRepository,
    private readonly activityRepository: IActivityRepository
  ) {}

  async execute(tripId: string): Promise<GetActivitiesDTOGroupedByDate> {
    const trip = await this.tripRepository.findTripById(tripId);

    if (!trip) {
      throw new TripNotFound();
    }

    const { activities } = await this.activityRepository.getActivities(tripId);

    const diffInDaysBetweenDates = dayjs(trip.endsAt).diff(
      dayjs(trip.startsAt),
      'day'
    );

    const activitiesGroupedByDate = Array.from(
      { length: diffInDaysBetweenDates + 1 },
      (_, index) => {
        const date = dayjs(trip.startsAt).add(index, 'days');

        return {
          date,
          activities: activities.filter((activity) =>
            dayjs(activity.occursAt).isSame(date, 'day')
          ),
        };
      }
    );

    return { activities: activitiesGroupedByDate };
  }
}
