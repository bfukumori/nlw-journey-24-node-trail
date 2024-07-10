import { TripAlreadyConfirmed } from '@/errors/TripAlreadyConfirmed.js';
import { TripNotFound } from '@/errors/TripNotFound.js';
import { Trip } from '@/repositories/dtos/getTripsDTO.js';
import { ITripRepository } from '@/repositories/interfaces/ITripRepository.js';

export class ConfirmTripUseCase {
  constructor(private readonly tripRepository: ITripRepository) {}

  async execute(tripId: string): Promise<Trip> {
    const trip = await this.tripRepository.findTripById(tripId);

    if (!trip) {
      throw new TripNotFound();
    }

    if (trip.isConfirmed) {
      throw new TripAlreadyConfirmed();
    }

    await this.tripRepository.confirmTrip(tripId);

    return {
      ...trip,
      participants: trip.participants.filter(
        (participant) => !participant.isOwner
      ),
    };
  }
}
