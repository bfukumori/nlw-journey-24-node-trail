import { InvalidDate } from '@/errors/InvalidDate.js';
import { TripNotFound } from '@/errors/TripNotFound.js';
import { dayjs } from '@/lib/dayjs.js';
import { UpdateTripDTORequest } from '@/repositories/dtos/updateTripDTO.js';
import { ITripRepository } from '@/repositories/interfaces/ITripRepository.js';

export class UpdateTripUseCase {
  constructor(private readonly tripRepository: ITripRepository) {}

  async execute({
    destination,
    startsAt,
    endsAt,
    tripId,
  }: UpdateTripDTORequest): Promise<void> {
    const trip = await this.tripRepository.findTripById(tripId);

    if (!trip) {
      throw new TripNotFound();
    }

    if (dayjs(startsAt).isBefore(new Date())) {
      throw new InvalidDate('Invalid trip start date');
    }

    if (dayjs(endsAt).isBefore(new Date())) {
      throw new InvalidDate('Invalid trip end date');
    }

    await this.tripRepository.updateTrip({
      destination,
      startsAt,
      endsAt,
      tripId,
    });
  }
}
