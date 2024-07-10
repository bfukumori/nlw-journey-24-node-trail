import { InvalidDate } from '@/errors/InvalidDate.js';
import { dayjs } from '@/lib/dayjs.js';
import {
  CreateTripDTORequest,
  CreateTripDTOResponse,
} from '@/repositories/dtos/createTripDTO.js';
import { ITripRepository } from '@/repositories/interfaces/ITripRepository.js';

export class CreateTripUseCase {
  constructor(private readonly tripRepository: ITripRepository) {}

  async execute({
    destination,
    startsAt,
    endsAt,
    ownerName,
    ownerEmail,
    emailsToInvite,
  }: CreateTripDTORequest): Promise<CreateTripDTOResponse> {
    if (dayjs(startsAt).isBefore(new Date())) {
      throw new InvalidDate('Invalid trip start date');
    }

    if (dayjs(endsAt).isBefore(new Date())) {
      throw new InvalidDate('Invalid trip end date');
    }

    const tripId = await this.tripRepository.createTrip({
      destination,
      startsAt,
      endsAt,
      ownerName,
      ownerEmail,
      emailsToInvite,
    });

    return tripId;
  }
}
