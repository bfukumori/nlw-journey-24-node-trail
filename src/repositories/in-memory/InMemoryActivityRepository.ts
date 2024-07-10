import { randomUUID } from 'node:crypto';

import {
  CreateActivityDTORequest,
  CreateActivityDTOResponse,
} from '../dtos/createActivityDTO.js';
import {
  Activity,
  GetActivitiesDTOResponse,
} from '../dtos/getActivitiesDTO.js';
import { IActivityRepository } from '../interfaces/IActivityRepository.js';

export class InMemoryActivityRepository implements IActivityRepository {
  public activities: Activity[] = [];

  async createActivity({
    occursAt,
    title,
    tripId,
  }: CreateActivityDTORequest): Promise<CreateActivityDTOResponse> {
    const activityId = randomUUID();

    const activity: Activity = {
      id: activityId,
      title,
      occursAt,
      tripId,
    };

    this.activities.push(activity);

    return { activityId };
  }

  async getActivities(tripId: string): Promise<GetActivitiesDTOResponse> {
    const activities = this.activities.filter(
      (activity) => activity.tripId === tripId
    );

    return {
      activities,
    };
  }
}
