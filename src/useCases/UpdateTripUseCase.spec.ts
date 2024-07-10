import { beforeEach, describe, expect, it } from 'vitest';

import { InvalidDate } from '@/errors/InvalidDate.js';
import { TripNotFound } from '@/errors/TripNotFound.js';
import { makeTripsInMemoryFactory } from '@/factories/in-memory/makeTripsInMemoryFactory.ts.js';
import { UpdateTripDTORequest } from '@/repositories/dtos/updateTripDTO.js';
import { InMemoryParticipantRepository } from '@/repositories/in-memory/InMemoryParticipantRepository.js';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';
import { UpdateTripUseCase } from './UpdateTripUseCase.js';

let inMemoryTripRepository: InMemoryTripRepository;
let inMemoryParticipantRepository: InMemoryParticipantRepository;
let sut: UpdateTripUseCase;

describe('UpdateTripUseCase', () => {
  beforeEach(async () => {
    inMemoryTripRepository = new InMemoryTripRepository();
    inMemoryParticipantRepository = new InMemoryParticipantRepository();
    sut = new UpdateTripUseCase(inMemoryTripRepository);
  });

  it('should be able to update a new trip', async () => {
    const { tripsData } = await makeTripsInMemoryFactory(
      inMemoryTripRepository,
      inMemoryParticipantRepository
    );

    const { id: tripId } = tripsData[0];

    const updateTripDTO: UpdateTripDTORequest = {
      tripId,
      destination: 'Santa Catarina',
      startsAt: new Date(2024, 6, 15, 12),
      endsAt: new Date(2024, 6, 21, 12),
    };

    await sut.execute(updateTripDTO);

    const response = await inMemoryTripRepository.findTripById(tripId);

    expect(response).toEqual({
      ...tripsData[0],
      destination: 'Santa Catarina',
    });
  });

  it('should not be able to update an unexistent trip', async () => {
    const updateTripDTO: UpdateTripDTORequest = {
      tripId: 'unexistent-trip-id',
      startsAt: new Date(2024, 6, 9, 12),
    };

    await expect(() => sut.execute(updateTripDTO)).rejects.toBeInstanceOf(
      TripNotFound
    );
  });

  it('should not be able to update a new trip with invalid start date', async () => {
    const { tripsData } = await makeTripsInMemoryFactory(
      inMemoryTripRepository,
      inMemoryParticipantRepository
    );

    const { id: tripId } = tripsData[0];

    const updateTripDTO: UpdateTripDTORequest = {
      tripId,
      startsAt: new Date(2024, 6, 9, 12),
    };

    await expect(() => sut.execute(updateTripDTO)).rejects.toBeInstanceOf(
      InvalidDate
    );
  });

  it('should not be able to update a new trip with invalid end date', async () => {
    const { tripsData } = await makeTripsInMemoryFactory(
      inMemoryTripRepository,
      inMemoryParticipantRepository
    );

    const { id: tripId } = tripsData[0];

    const updateTripDTO: UpdateTripDTORequest = {
      tripId,
      endsAt: new Date(2024, 6, 9, 12),
    };

    await expect(() => sut.execute(updateTripDTO)).rejects.toBeInstanceOf(
      InvalidDate
    );
  });
});
