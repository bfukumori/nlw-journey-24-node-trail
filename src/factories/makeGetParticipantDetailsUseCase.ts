import { PrismaParticipantRepository } from '@/repositories/implementations/PrismaParticipantRepository.js';
import { GetParticipantDetailsUseCase } from '@/useCases/GetParticipantDetailsUseCase.js';

export async function makeGetParticipantDetailsUseCase() {
  const participantRepository = new PrismaParticipantRepository();
  const getParticipantDetailsUseCase = new GetParticipantDetailsUseCase(
    participantRepository
  );

  return getParticipantDetailsUseCase;
}
