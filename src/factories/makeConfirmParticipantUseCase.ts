import { PrismaTripRepository } from '@/repositories/implementations/PrismaTripRepository.js';
import { ConfirmParticipantUseCase } from '@/useCases/ConfirmParticipantUseCase.js';

export async function makeConfirmParticipantUseCase() {
  const tripRepository = new PrismaTripRepository();
  const confirmParticipantUseCase = new ConfirmParticipantUseCase(
    tripRepository
  );

  return confirmParticipantUseCase;
}
