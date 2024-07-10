import { PrismaParticipantRepository } from '@/repositories/implementations/PrismaParticipantRepository.js';
import { PrismaTripRepository } from '@/repositories/implementations/PrismaTripRepository.js';
import { CreateInviteUseCase } from '@/useCases/CreateInviteUseCase.js';

export async function makeCreateInviteUseCase() {
  const tripRepository = new PrismaTripRepository();
  const participantRepository = new PrismaParticipantRepository();
  const createInviteUseCase = new CreateInviteUseCase(
    tripRepository,
    participantRepository
  );

  return createInviteUseCase;
}
