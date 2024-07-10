import { PrismaTripRepository } from '@/repositories/implementations/PrismaTripRepository.js';
import { GetTripDetailsUseCase } from '@/useCases/GetTripDetailsUseCase.js';

export async function makeGetTripDetailsUseCase() {
  const tripRepository = new PrismaTripRepository();
  const getTripDetailsUseCase = new GetTripDetailsUseCase(tripRepository);

  return getTripDetailsUseCase;
}
