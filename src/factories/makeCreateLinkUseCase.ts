import { PrismaLinkRepository } from '@/repositories/implementations/PrismaLinkRepository.js';
import { PrismaTripRepository } from '@/repositories/implementations/PrismaTripRepository.js';
import { CreateLinkUseCase } from '@/useCases/CreateLinkUseCase.js';

export async function makeCreateLinkUseCase() {
  const tripRepository = new PrismaTripRepository();
  const linkRepository = new PrismaLinkRepository();
  const createLinkUseCase = new CreateLinkUseCase(
    tripRepository,
    linkRepository
  );

  return createLinkUseCase;
}
