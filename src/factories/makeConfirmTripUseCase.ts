import { PrismaTripRepository } from '@/repositories/implementations/PrismaTripRepository.js';
import { ConfirmTripUseCase } from '@/useCases/ConfirmTripUseCase.js';

export async function makeConfirmTripUseCase() {
  const tripRepository = new PrismaTripRepository();
  const confirmTripUseCase = new ConfirmTripUseCase(tripRepository);

  return confirmTripUseCase;
}
