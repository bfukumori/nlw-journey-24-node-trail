import { TripNotFound } from '@/errors/TripNotFound.js';
import { CreateInviteDTORequest } from '@/repositories/dtos/createInviteDTO.js';
import { Participant } from '@/repositories/dtos/getParticipantsDTO.js';
import { IParticipantRepository } from '@/repositories/interfaces/IParticipantRepository.js';
import { ITripRepository } from '@/repositories/interfaces/ITripRepository.js';

export class CreateInviteUseCase {
  constructor(
    private readonly tripRepository: ITripRepository,
    private readonly participantRepository: IParticipantRepository
  ) {}

  async execute({
    email,
    tripId,
  }: CreateInviteDTORequest): Promise<Participant> {
    const trip = await this.tripRepository.findTripById(tripId);

    if (!trip) {
      throw new TripNotFound();
    }

    const participant = await this.participantRepository.createInvite({
      email,
      tripId,
    });

    return participant;
  }
}
