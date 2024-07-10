import { beforeEach, describe, expect, it } from 'vitest';

import { TripNotFound } from '@/errors/TripNotFound.js';
import { makeTripsInMemoryFactory } from '@/factories/in-memory/makeTripsInMemoryFactory.ts.js';
import { InMemoryParticipantRepository } from '@/repositories/in-memory/InMemoryParticipantRepository.js';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';
import { GetTripDetailsUseCase } from './GetTripDetailsUseCase.js';

let inMemoryTripRepository: InMemoryTripRepository;
let inMemoryParticipantRepository: InMemoryParticipantRepository;
let sut: GetTripDetailsUseCase;

describe('GetTripDetailsUseCase', () => {
  beforeEach(() => {
    inMemoryTripRepository = new InMemoryTripRepository();
    inMemoryParticipantRepository = new InMemoryParticipantRepository();
    sut = new GetTripDetailsUseCase(inMemoryTripRepository);
  });

  it('should be able to get details of a trip', async () => {
    const { tripsData } = await makeTripsInMemoryFactory(
      inMemoryTripRepository,
      inMemoryParticipantRepository
    );
    const trip = await sut.execute(tripsData[0].id);

    expect(trip).toEqual(tripsData[0]);
  });

  it('should not be able to get details of an inexistent trip', async () => {
    await makeTripsInMemoryFactory(
      inMemoryTripRepository,
      inMemoryParticipantRepository
    );

    await expect(() => sut.execute('invalid id')).rejects.toBeInstanceOf(
      TripNotFound
    );
  });
});
