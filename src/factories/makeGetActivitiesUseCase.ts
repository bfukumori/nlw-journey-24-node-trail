import { PrismaActivityRepository } from '@/repositories/implementations/PrismaActivityRepository.js';
import { PrismaTripRepository } from '@/repositories/implementations/PrismaTripRepository.js';
import { GetActivitiesUseCase } from '@/useCases/GetActivitiesUseCase.js';

export async function makeGetActivitiesUseCase() {
  const tripRepository = new PrismaTripRepository();
  const activityRepository = new PrismaActivityRepository();
  const getActivitiesUseCase = new GetActivitiesUseCase(
    tripRepository,
    activityRepository
  );

  return getActivitiesUseCase;
}
