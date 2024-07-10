import { IParticipantRepository } from '@/repositories/interfaces/IParticipantRepository.js';

export class GetParticipantsUseCase {
  constructor(private readonly participantRepository: IParticipantRepository) {}

  async execute(tripId: string) {
    const participants = await this.participantRepository.getParticipants(
      tripId
    );

    return participants;
  }
}
