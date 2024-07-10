import { ParticipantAlreadyConfirmed } from '@/errors/ParticipantAlreadyConfirmed.js';
import { ParticipantNotFound } from '@/errors/ParticipantNotFound.js';
import { Participant } from '@/repositories/dtos/getParticipantsDTO.js';
import { IParticipantRepository } from '@/repositories/interfaces/IParticipantRepository.js';

export class ConfirmParticipantUseCase {
  constructor(private readonly participantRepository: IParticipantRepository) {}

  async execute(participantId: string): Promise<Participant> {
    const participant = await this.participantRepository.findParticipantById(
      participantId
    );

    if (!participant) {
      throw new ParticipantNotFound();
    }

    if (participant.isConfirmed) {
      throw new ParticipantAlreadyConfirmed();
    }

    await this.participantRepository.confirmParticipant(participantId);

    return participant;
  }
}
