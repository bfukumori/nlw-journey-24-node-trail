import { beforeEach, describe, expect, it } from 'vitest';

import { InvalidDate } from '@/errors/InvalidDate.js';
import { TripNotFound } from '@/errors/TripNotFound.js';
import { makeTripsInMemoryFactory } from '@/factories/in-memory/makeTripsInMemoryFactory.ts.js';
import { CreateActivityDTORequest } from '@/repositories/dtos/createActivityDTO.js';
import { InMemoryActivityRepository } from '@/repositories/in-memory/InMemoryActivityRepository.js';
import { InMemoryParticipantRepository } from '@/repositories/in-memory/InMemoryParticipantRepository.js';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';
import { CreateActivityUseCase } from './CreateActivityUseCase.js';

let inMemoryTripRepository: InMemoryTripRepository;
let inMemoryParticipantRepository: InMemoryParticipantRepository;
let inMemoryActivityRepository: InMemoryActivityRepository;
let sut: CreateActivityUseCase;
let createActivityDTO: CreateActivityDTORequest;

describe('CreateActivityUseCase', () => {
  beforeEach(async () => {
    inMemoryTripRepository = new InMemoryTripRepository();
    inMemoryParticipantRepository = new InMemoryParticipantRepository();
    inMemoryActivityRepository = new InMemoryActivityRepository();
    sut = new CreateActivityUseCase(
      inMemoryTripRepository,
      inMemoryActivityRepository
    );

    const { tripsData } = await makeTripsInMemoryFactory(
      inMemoryTripRepository,
      inMemoryParticipantRepository
    );

    const { startsAt, id: tripId } = tripsData[0];

    createActivityDTO = {
      title: 'Visit the museum',
      occursAt: startsAt,
      tripId,
    };
  });

  it('should be able to create an activity for a trip', async () => {
    const response = await sut.execute(createActivityDTO);

    expect(response).toEqual({ activityId: expect.any(String) });
  });

  it('should not be able to create an activity for an unexistent trip', async () => {
    createActivityDTO.tripId = 'invalid-trip-id';

    await expect(() => sut.execute(createActivityDTO)).rejects.toBeInstanceOf(
      TripNotFound
    );
  });

  it('should not be able to create an activity before trip start date', async () => {
    createActivityDTO.occursAt = new Date(2024, 6, 9, 12);

    await expect(() => sut.execute(createActivityDTO)).rejects.toBeInstanceOf(
      InvalidDate
    );
  });

  it('should not be able to create an activity after trip end date', async () => {
    createActivityDTO.occursAt = new Date(2024, 6, 21, 12);

    await expect(() => sut.execute(createActivityDTO)).rejects.toBeInstanceOf(
      InvalidDate
    );
  });
});
