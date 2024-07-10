import { TripNotFound } from '@/errors/TripNotFound.js';
import { ITripRepository } from '@/repositories/interfaces/ITripRepository.js';

export class GetTripDetailsUseCase {
  constructor(private readonly tripRepository: ITripRepository) {}

  async execute(tripId: string) {
    const trip = await this.tripRepository.findTripById(tripId);

    if (!trip) {
      throw new TripNotFound();
    }

    return trip;
  }
}
