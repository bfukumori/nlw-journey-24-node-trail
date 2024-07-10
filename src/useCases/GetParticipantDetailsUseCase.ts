import { ParticipantNotFound } from '@/errors/ParticipantNotFound.js';
import { IParticipantRepository } from '@/repositories/interfaces/IParticipantRepository.js';

export class GetParticipantDetailsUseCase {
  constructor(private readonly participantRepository: IParticipantRepository) {}

  async execute(participantId: string) {
    const participant = await this.participantRepository.findParticipantById(
      participantId
    );

    if (!participant) {
      throw new ParticipantNotFound();
    }

    return participant;
  }
}
