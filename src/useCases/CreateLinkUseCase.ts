import { TripNotFound } from '@/errors/TripNotFound.js';
import {
  CreateLinkDTORequest,
  CreateLinkDTOResponse,
} from '@/repositories/dtos/createLinkDTO.js';
import { ILinkRepository } from '@/repositories/interfaces/ILinkRepository.js';
import { ITripRepository } from '@/repositories/interfaces/ITripRepository.js';

export class CreateLinkUseCase {
  constructor(
    private readonly tripRepository: ITripRepository,
    private readonly linkRepository: ILinkRepository
  ) {}

  async execute({
    title,
    url,
    tripId,
  }: CreateLinkDTORequest): Promise<CreateLinkDTOResponse> {
    const trip = await this.tripRepository.findTripById(tripId);

    if (!trip) {
      throw new TripNotFound();
    }

    const { linkId } = await this.linkRepository.createLink({
      title,
      url,
      tripId,
    });

    return { linkId };
  }
}
