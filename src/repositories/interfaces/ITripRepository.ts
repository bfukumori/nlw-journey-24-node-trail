import {
  CreateTripDTORequest,
  CreateTripDTOResponse,
} from '../dtos/createTripDTO.js';
import { GetTripsDTOResponse, Participant, Trip } from '../dtos/getTripsDTO.js';

export interface ITripRepository {
  createTrip(params: CreateTripDTORequest): Promise<CreateTripDTOResponse>;
  getTrips(page?: number): Promise<GetTripsDTOResponse>;
  confirmTrip(tripId: string): Promise<void>;
  findTripById(tripId: string): Promise<Trip | null>;
  findParticipantById(participantId: string): Promise<Participant | null>;
  confirmParticipant(participantId: string): Promise<void>;
}
