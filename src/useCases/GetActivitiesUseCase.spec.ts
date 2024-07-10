import { beforeEach, describe, expect, it } from 'vitest';

import { TripNotFound } from '@/errors/TripNotFound.js';
import { makeActivitiesInMemoryFactory } from '@/factories/in-memory/makeActivitiesInMemoryFactory.ts.js';
import { makeTripsInMemoryFactory } from '@/factories/in-memory/makeTripsInMemoryFactory.ts.js';
import { InMemoryActivityRepository } from '@/repositories/in-memory/InMemoryActivityRepository.js';
import { InMemoryParticipantRepository } from '@/repositories/in-memory/InMemoryParticipantRepository.js';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';
import { GetActivitiesUseCase } from './GetActivitiesUseCase.js';

let inMemoryTripRepository: InMemoryTripRepository;
let inMemoryParticipantRepository: InMemoryParticipantRepository;
let inMemoryActivityRepository: InMemoryActivityRepository;
let sut: GetActivitiesUseCase;

describe('GetActivitiesUseCase', () => {
  beforeEach(async () => {
    inMemoryTripRepository = new InMemoryTripRepository();
    inMemoryParticipantRepository = new InMemoryParticipantRepository();
    inMemoryActivityRepository = new InMemoryActivityRepository();
    sut = new GetActivitiesUseCase(
      inMemoryTripRepository,
      inMemoryActivityRepository
    );
  });

  it('should be able to list all activities created for a trip', async () => {
    const { tripsData } = await makeTripsInMemoryFactory(
      inMemoryTripRepository,
      inMemoryParticipantRepository
    );
    const tripId = tripsData[0].id;

    await makeActivitiesInMemoryFactory(
      inMemoryTripRepository,
      inMemoryParticipantRepository,
      inMemoryActivityRepository
    );

    const response = await sut.execute(tripId);

    expect(response.activities).toHaveLength(11);
  });

  it('should not be able to list activities for an unexistent trip', async () => {
    await expect(() => sut.execute('unexistent id')).rejects.toBeInstanceOf(
      TripNotFound
    );
  });
});
