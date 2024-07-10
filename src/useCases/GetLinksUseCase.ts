import { TripNotFound } from '@/errors/TripNotFound.js';

import { ILinkRepository } from '@/repositories/interfaces/ILinkRepository.js';
import { ITripRepository } from '@/repositories/interfaces/ITripRepository.js';
import { GetLinksDTOResponse } from '@/repositories/dtos/getLinksDTO.js';

export class GetLinksUseCase {
  constructor(
    private readonly tripRepository: ITripRepository,
    private readonly linkRepository: ILinkRepository
  ) {}

  async execute(tripId: string): Promise<GetLinksDTOResponse> {
    const trip = await this.tripRepository.findTripById(tripId);

    if (!trip) {
      throw new TripNotFound();
    }

    const { links } = await this.linkRepository.getLinks(tripId);

    return { links };
  }
}
