import { prisma } from '@/lib/prisma.js';
import { ITripRepository } from '../interfaces/ITripRepository.js';
import { CreateTripDTORequest } from '../dtos/createTripDTO.js';

export class PrismaTripRepository implements ITripRepository {
  async createTrip({
    destination,
    startsAt,
    endsAt,
    ownerName,
    ownerEmail,
    emailsToInvite,
  }: CreateTripDTORequest) {
    const { id } = await prisma.trip.create({
      data: {
        destination,
        starts_at: startsAt,
        ends_at: endsAt,
        participants: {
          createMany: {
            data: [
              {
                name: ownerName,
                email: ownerEmail,
                is_confirmed: true,
                is_owner: true,
              },
              ...emailsToInvite.map((email) => ({
                email,
                is_confirmed: false,
                is_owner: false,
              })),
            ],
          },
        },
      },
    });

    return { tripId: id };
  }

  async getTrips(page: number) {
    const trips = await prisma.trip.findMany({
      skip: (page - 1) * 10,
      take: 10,
      include: {
        participants: true,
      },
    });

    return {
      trips: trips.map((trip) => ({
        id: trip.id,
        destination: trip.destination,
        startsAt: trip.starts_at,
        endsAt: trip.ends_at,
        createdAt: trip.created_at,
        isConfirmed: trip.is_confirmed,
        participants: trip.participants.map((participant) => ({
          id: participant.id,
          name: participant.name,
          email: participant.email,
          isConfirmed: participant.is_confirmed,
          isOwner: participant.is_owner,
          tripId: participant.trip_id,
        })),
      })),
      total: await prisma.trip.count(),
    };
  }

  async confirmTrip(tripId: string): Promise<void> {
    await prisma.trip.update({
      where: {
        id: tripId,
      },
      data: {
        is_confirmed: true,
      },
    });
  }

  async findTripById(tripId: string) {
    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId,
      },
      include: {
        participants: true,
      },
    });

    if (!trip) {
      return null;
    }

    return {
      id: trip.id,
      destination: trip.destination,
      startsAt: trip.starts_at,
      endsAt: trip.ends_at,
      createdAt: trip.created_at,
      isConfirmed: trip.is_confirmed,
      participants: trip.participants.map((participant) => ({
        id: participant.id,
        name: participant.name,
        email: participant.email,
        isConfirmed: participant.is_confirmed,
        isOwner: participant.is_owner,
        tripId: participant.trip_id,
      })),
    };
  }

  async confirmParticipant(participantId: string): Promise<void> {
    await prisma.participant.update({
      where: {
        id: participantId,
      },
      data: {
        is_confirmed: true,
      },
    });
  }

  async findParticipantById(participantId: string) {
    const participant = await prisma.participant.findUnique({
      where: {
        id: participantId,
      },
    });

    if (!participant) {
      return null;
    }

    return {
      id: participant.id,
      name: participant.name,
      email: participant.email,
      isConfirmed: participant.is_confirmed,
      isOwner: participant.is_owner,
      tripId: participant.trip_id,
    };
  }
}
