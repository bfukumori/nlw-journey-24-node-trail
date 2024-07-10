import { PrismaParticipantRepository } from '@/repositories/implementations/PrismaParticipantRepository.js';
import { ConfirmParticipantUseCase } from '@/useCases/ConfirmParticipantUseCase.js';

export async function makeConfirmParticipantUseCase() {
  const participantRepository = new PrismaParticipantRepository();
  const confirmParticipantUseCase = new ConfirmParticipantUseCase(
    participantRepository
  );

  return confirmParticipantUseCase;
}
