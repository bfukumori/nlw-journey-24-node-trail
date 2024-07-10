import { randomUUID } from 'node:crypto';
import { CreateTripDTORequest } from '../dtos/createTripDTO.js';
import { ITripRepository } from '../interfaces/ITripRepository.js';
import { Participant, Trip } from '../dtos/getTripsDTO.js';

export class InMemoryTripRepository implements ITripRepository {
  private trips: Trip[] = [];
  private participants: Participant[] = [];

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

    this.participants = [
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
    ];

    const trip: Trip = {
      id: tripId,
      destination,
      startsAt,
      endsAt,
      createdAt: new Date(),
      participants: this.participants,
      isConfirmed: false,
    };

    this.trips.push(trip);

    return { tripId };
  }

  async getTrips(page: number) {
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

  async confirmParticipant(participantId: string): Promise<void> {
    const participant = await this.findParticipantById(participantId);

    if (participant) {
      participant.isConfirmed = true;
    }
  }

  async findParticipantById(participantId: string) {
    return (
      this.participants.find(
        (participant) => participant.id === participantId
      ) ?? null
    );
  }
}
