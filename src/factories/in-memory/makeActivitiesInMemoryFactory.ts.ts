import { InMemoryActivityRepository } from '@/repositories/in-memory/InMemoryActivityRepository.js';
import { InMemoryParticipantRepository } from '@/repositories/in-memory/InMemoryParticipantRepository.js';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';
import { makeTripsInMemoryFactory } from './makeTripsInMemoryFactory.ts.js';

export async function makeActivitiesInMemoryFactory(
  inMemoryTripRepository: InMemoryTripRepository,
  inMemoryParticipantRepository: InMemoryParticipantRepository,
  inMemoryActivityRepository: InMemoryActivityRepository
) {
  const { tripsData } = await makeTripsInMemoryFactory(
    inMemoryTripRepository,
    inMemoryParticipantRepository
  );
  const { id: tripId, startsAt, endsAt } = tripsData[0];

  await inMemoryActivityRepository.createActivity({
    title: 'Visit the museum',
    occursAt: startsAt,
    tripId,
  });

  await inMemoryActivityRepository.createActivity({
    title: 'Visit the aquarium',
    occursAt: endsAt,
    tripId,
  });

  return {
    activitiesData: inMemoryActivityRepository.activities,
  };
}
