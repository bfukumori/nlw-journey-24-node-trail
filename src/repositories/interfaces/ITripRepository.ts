import {
  CreateTripDTORequest,
  CreateTripDTOResponse,
} from '../dtos/createTripDTO.js';
import { GetTripsDTOResponse, Trip } from '../dtos/getTripsDTO.js';
import { UpdateTripDTORequest } from '../dtos/updateTripDTO.js';

export interface ITripRepository {
  createTrip(params: CreateTripDTORequest): Promise<CreateTripDTOResponse>;
  getTrips(page?: number): Promise<GetTripsDTOResponse>;
  confirmTrip(tripId: string): Promise<void>;
  findTripById(tripId: string): Promise<Trip | null>;
  updateTrip(params: UpdateTripDTORequest): Promise<void>;
}
