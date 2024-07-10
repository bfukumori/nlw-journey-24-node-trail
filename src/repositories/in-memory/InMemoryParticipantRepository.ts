import { randomUUID } from 'node:crypto';

import { CreateInviteDTORequest } from '../dtos/createInviteDTO.js';
import {
  GetParticipantsDTOResponse,
  Participant,
} from '../dtos/getParticipantsDTO.js';
import { IParticipantRepository } from '../interfaces/IParticipantRepository.js';

export class InMemoryParticipantRepository implements IParticipantRepository {
  public participants: Participant[] = [];

  async getParticipants(tripId: string): Promise<GetParticipantsDTOResponse> {
    const participants = this.participants.filter(
      (participant) => participant.tripId === tripId
    );

    return { participants };
  }

  async findParticipantById(
    participantId: string
  ): Promise<Participant | null> {
    const participant = this.participants.find(
      (participant) => participant.id === participantId
    );
    return participant ? participant : null;
  }

  async confirmParticipant(participantId: string): Promise<void> {
    const participant = await this.findParticipantById(participantId);

    if (participant) {
      participant.isConfirmed = true;
    }
  }

  async createInvite({
    email,
    tripId,
  }: CreateInviteDTORequest): Promise<Participant> {
    const participantId = randomUUID();

    const participant = {
      id: participantId,
      email,
      isConfirmed: false,
      isOwner: false,
      tripId,
    };

    this.participants.push(participant);

    return participant;
  }
}
