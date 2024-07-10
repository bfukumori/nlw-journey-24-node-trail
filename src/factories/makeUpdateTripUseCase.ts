import { PrismaTripRepository } from '@/repositories/implementations/PrismaTripRepository.js';
import { UpdateTripUseCase } from '@/useCases/UpdateTripUseCase.js';

export async function makeUpdateTripUseCase() {
  const tripRepository = new PrismaTripRepository();
  const updateTripUseCase = new UpdateTripUseCase(tripRepository);

  return updateTripUseCase;
}
