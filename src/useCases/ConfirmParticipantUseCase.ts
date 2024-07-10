import { ParticipantAlreadyConfirmed } from '@/errors/ParticipantAlreadyConfirmed.js';
import { ParticipantNotFound } from '@/errors/ParticipantNotFound.js';
import { Participant } from '@/repositories/dtos/listTripsDTO.js';
import { ITripRepository } from '@/repositories/interfaces/ITripRepository.js';

export class ConfirmParticipantUseCase {
  constructor(private readonly tripRepository: ITripRepository) {}

  async execute(participantId: string): Promise<Participant> {
    const participant = await this.tripRepository.findParticipantById(
      participantId
    );

    if (!participant) {
      throw new ParticipantNotFound();
    }

    if (participant.isConfirmed) {
      throw new ParticipantAlreadyConfirmed();
    }

    await this.tripRepository.confirmParticipant(participantId);

    return participant;
  }
}
