import { PrismaTripRepository } from '@/repositories/implementations/PrismaTripRepository.js';
import { CreateTripUseCase } from '@/useCases/CreateTripUseCase.js';

export async function makeCreateTripUseCase() {
  const tripRepository = new PrismaTripRepository();
  const createTripUseCase = new CreateTripUseCase(tripRepository);

  return createTripUseCase;
}
