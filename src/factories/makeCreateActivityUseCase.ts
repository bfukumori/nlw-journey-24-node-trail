import { PrismaActivityRepository } from '@/repositories/implementations/PrismaActivityRepository.js';
import { PrismaTripRepository } from '@/repositories/implementations/PrismaTripRepository.js';
import { CreateActivityUseCase } from '@/useCases/CreateActivityUseCase.js';

export async function makeCreateActivityUseCase() {
  const tripRepository = new PrismaTripRepository();
  const activityRepository = new PrismaActivityRepository();
  const createActivityUseCase = new CreateActivityUseCase(
    tripRepository,
    activityRepository
  );

  return createActivityUseCase;
}
