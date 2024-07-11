import { prisma } from '@/lib/prisma.js';
import { CreateInviteDTORequest } from '../dtos/createInviteDTO.js';
import { IParticipantRepository } from '../interfaces/IParticipantRepository.js';

export class PrismaParticipantRepository implements IParticipantRepository {
  async getParticipants(tripId: string) {
    const participants = await prisma.participant.findMany({
      where: {
        trip_id: tripId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        is_confirmed: true,
      },
    });

    return {
      participants: participants.map((participant) => ({
        id: participant.id,
        name: participant.name,
        email: participant.email,
        isConfirmed: participant.is_confirmed,
      })),
    };
  }

  async findParticipantById(participantId: string) {
    const participant = await prisma.participant.findUnique({
      where: {
        id: participantId,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!participant) {
      return null;
    }

    return {
      id: participant.id,
      name: participant.name,
      email: participant.email,
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

  async createInvite({ email, tripId }: CreateInviteDTORequest) {
    const participant = await prisma.participant.create({
      data: {
        email,
        trip_id: tripId,
      },
    });

    return {
      id: participant.id,
      email: participant.email,
    };
  }
}
