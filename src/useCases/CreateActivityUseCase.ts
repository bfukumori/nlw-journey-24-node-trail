import { InvalidDate } from '@/errors/InvalidDate.js';
import { TripNotFound } from '@/errors/TripNotFound.js';
import { dayjs } from '@/lib/dayjs.js';
import {
  CreateActivityDTORequest,
  CreateActivityDTOResponse,
} from '@/repositories/dtos/createActivityDTO.js';
import { IActivityRepository } from '@/repositories/interfaces/IActivityRepository.js';
import { ITripRepository } from '@/repositories/interfaces/ITripRepository.js';

export class CreateActivityUseCase {
  constructor(
    private readonly tripRepository: ITripRepository,
    private readonly activityRepository: IActivityRepository
  ) {}

  async execute({
    title,
    occursAt,
    tripId,
  }: CreateActivityDTORequest): Promise<CreateActivityDTOResponse> {
    const trip = await this.tripRepository.findTripById(tripId);

    if (!trip) {
      throw new TripNotFound();
    }

    if (dayjs(occursAt).isBefore(dayjs(trip.startsAt))) {
      throw new InvalidDate('Activity date cannot be before trip start date');
    }

    if (dayjs(occursAt).isAfter(dayjs(trip.endsAt))) {
      throw new InvalidDate('Activity date cannot be after trip end date');
    }

    const { activityId } = await this.activityRepository.createActivity({
      title,
      occursAt,
      tripId,
    });

    return { activityId };
  }
}
