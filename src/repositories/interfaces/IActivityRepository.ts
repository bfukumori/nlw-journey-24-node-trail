import {
  CreateActivityDTORequest,
  CreateActivityDTOResponse,
} from '../dtos/createActivityDTO.js';
import { GetActivitiesDTOResponse } from '../dtos/getActivitiesDTO.js';

export interface IActivityRepository {
  createActivity(
    params: CreateActivityDTORequest
  ): Promise<CreateActivityDTOResponse>;
  getActivities(tripId: string): Promise<GetActivitiesDTOResponse>;
}
