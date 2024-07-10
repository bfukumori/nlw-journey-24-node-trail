import { PrismaParticipantRepository } from '@/repositories/implementations/PrismaParticipantRepository.js';
import { GetParticipantsUseCase } from '@/useCases/GetParticipantsUseCase.js';

export async function makeGetParticipantsUseCase() {
  const participantRepository = new PrismaParticipantRepository();
  const getParticipantsUseCase = new GetParticipantsUseCase(
    participantRepository
  );

  return getParticipantsUseCase;
}
