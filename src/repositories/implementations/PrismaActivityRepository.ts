import { prisma } from '@/lib/prisma.js';
import { CreateActivityDTORequest } from '../dtos/createActivityDTO.js';
import { IActivityRepository } from '../interfaces/IActivityRepository.js';

export class PrismaActivityRepository implements IActivityRepository {
  async createActivity({ occursAt, title, tripId }: CreateActivityDTORequest) {
    const { id } = await prisma.activity.create({
      data: {
        title,
        occurs_at: occursAt,
        trip_id: tripId,
      },
    });

    return { activityId: id };
  }

  async getActivities(tripId: string) {
    const activities = await prisma.activity.findMany({
      where: {
        trip_id: tripId,
      },
      orderBy: {
        occurs_at: 'asc',
      },
    });

    return {
      activities: activities.map((activity) => ({
        id: activity.id,
        title: activity.title,
        occursAt: activity.occurs_at,
        tripId: activity.trip_id,
      })),
    };
  }
}
