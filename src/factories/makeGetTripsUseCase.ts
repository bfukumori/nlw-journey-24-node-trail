import { PrismaTripRepository } from '@/repositories/implementations/PrismaTripRepository.js';
import { GetTripsUseCase } from '@/useCases/GetTripsUseCase.js';

export async function makeGetTripsUseCase() {
  const tripRepository = new PrismaTripRepository();
  const getTripsUseCase = new GetTripsUseCase(tripRepository);

  return getTripsUseCase;
}
