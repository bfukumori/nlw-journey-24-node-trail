import { GetTripsDTOResponse } from '@/repositories/dtos/getTripsDTO.js';
import { ITripRepository } from '@/repositories/interfaces/ITripRepository.js';

export class GetTripsUseCase {
  constructor(private readonly tripRepository: ITripRepository) {}

  async execute(page?: number): Promise<GetTripsDTOResponse> {
    const trips = await this.tripRepository.getTrips(page);

    return trips;
  }
}
