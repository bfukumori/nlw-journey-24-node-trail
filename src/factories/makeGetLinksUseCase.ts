import { PrismaLinkRepository } from '@/repositories/implementations/PrismaLinkRepository.js';
import { PrismaTripRepository } from '@/repositories/implementations/PrismaTripRepository.js';
import { GetLinksUseCase } from '@/useCases/GetLinksUseCase.js';

export async function makeGetLinksUseCase() {
  const tripRepository = new PrismaTripRepository();
  const linkRepository = new PrismaLinkRepository();
  const getLinksUseCase = new GetLinksUseCase(tripRepository, linkRepository);

  return getLinksUseCase;
}
