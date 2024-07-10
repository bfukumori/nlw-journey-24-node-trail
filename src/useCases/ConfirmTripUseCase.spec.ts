import { beforeEach, describe, expect, it } from 'vitest';

import { TripAlreadyConfirmed } from '@/errors/TripAlreadyConfirmed.js';
import { TripNotFound } from '@/errors/TripNotFound.js';
import { makeTripsInMemoryFactory } from '@/factories/in-memory/makeTripsInMemoryFactory.ts.js';
import { InMemoryParticipantRepository } from '@/repositories/in-memory/InMemoryParticipantRepository.js';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';
import { ConfirmTripUseCase } from './ConfirmTripUseCase.js';

let inMemoryTripRepository: InMemoryTripRepository;
let inMemoryParticipantRepository: InMemoryParticipantRepository;
let sut: ConfirmTripUseCase;

describe('ConfirmTripUseCase', () => {
  beforeEach(() => {
    inMemoryTripRepository = new InMemoryTripRepository();
    inMemoryParticipantRepository = new InMemoryParticipantRepository();
    sut = new ConfirmTripUseCase(inMemoryTripRepository);
  });

  it('should be able to confirm a trip', async () => {
    const { tripsData } = await makeTripsInMemoryFactory(
      inMemoryTripRepository,
      inMemoryParticipantRepository
    );
    const tripId = tripsData[0].id;

    await sut.execute(tripId);

    const trip = await inMemoryTripRepository.findTripById(tripId);

    expect(trip).toEqual({ ...trip, isConfirmed: true });
  });

  it('should not be able to confirm an inexistent trip', async () => {
    await expect(() => sut.execute('invalid id')).rejects.toBeInstanceOf(
      TripNotFound
    );
  });

  it('should not be able to confirm an already confirmed trip', async () => {
    const { tripsData } = await makeTripsInMemoryFactory(
      inMemoryTripRepository,
      inMemoryParticipantRepository
    );
    const tripId = tripsData[0].id;

    await inMemoryTripRepository.confirmTrip(tripId);

    await expect(() => sut.execute(tripId)).rejects.toBeInstanceOf(
      TripAlreadyConfirmed
    );
  });
});
