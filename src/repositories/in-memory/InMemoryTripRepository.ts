import { randomUUID } from 'node:crypto';

import { CreateTripDTORequest } from '../dtos/createTripDTO.js';
import { Trip } from '../dtos/getTripsDTO.js';
import { UpdateTripDTORequest } from '../dtos/updateTripDTO.js';
import { ITripRepository } from '../interfaces/ITripRepository.js';

export class InMemoryTripRepository implements ITripRepository {
  private trips: Trip[] = [];

  async createTrip({
    destination,
    startsAt,
    endsAt,
    ownerName,
    ownerEmail,
    emailsToInvite,
  }: CreateTripDTORequest) {
    const tripId = randomUUID();
    const ownerId = randomUUID();
    const participantId = randomUUID();

    const trip: Trip = {
      id: tripId,
      destination,
      startsAt,
      endsAt,
      createdAt: new Date(2024, 6, 10, 12),
      participants: [
        {
          id: ownerId,
          name: ownerName,
          email: ownerEmail,
          isConfirmed: true,
          isOwner: true,
          tripId,
        },
        ...emailsToInvite.map((email) => ({
          id: participantId,
          email,
          isConfirmed: false,
          isOwner: false,
          tripId,
        })),
      ],
      isConfirmed: false,
    };

    this.trips.push(trip);

    return { tripId };
  }

  async getTrips(page: number = 1) {
    const tripsPerPage = 10;
    const initialIndex = (page - 1) * tripsPerPage;
    const finalIndex = initialIndex + tripsPerPage;

    const trips = this.trips.slice(initialIndex, finalIndex);

    return { trips, total: this.trips.length };
  }

  async confirmTrip(tripId: string) {
    const trip = await this.findTripById(tripId);

    if (trip) {
      trip.isConfirmed = true;
    }
  }

  async findTripById(tripId: string) {
    return this.trips.find((trip) => trip.id === tripId) ?? null;
  }

  async updateTrip({
    destination,
    endsAt,
    startsAt,
    tripId,
  }: UpdateTripDTORequest): Promise<void> {
    const trip = await this.findTripById(tripId);

    if (trip) {
      if (destination) {
        trip.destination = destination;
      }
      if (startsAt) {
        trip.startsAt = startsAt;
      }
      if (endsAt) {
        trip.endsAt = endsAt;
      }
    }
  }
}
