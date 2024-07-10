import { beforeEach, describe, expect, it } from 'vitest';

import { TripNotFound } from '@/errors/TripNotFound.js';
import { makeTripsInMemoryFactory } from '@/factories/in-memory/makeTripsInMemoryFactory.ts.js';
import { InMemoryLinkRepository } from '@/repositories/in-memory/InMemoryLinkRepository.js';
import { InMemoryParticipantRepository } from '@/repositories/in-memory/InMemoryParticipantRepository.js';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';
import { CreateLinkUseCase } from './CreateLinkUseCase.js';

let inMemoryTripRepository: InMemoryTripRepository;
let inMemoryParticipantRepository: InMemoryParticipantRepository;
let inMemoryLinkRepository: InMemoryLinkRepository;
let sut: CreateLinkUseCase;

describe('CreateLinkUseCase', () => {
  beforeEach(async () => {
    inMemoryTripRepository = new InMemoryTripRepository();
    inMemoryParticipantRepository = new InMemoryParticipantRepository();
    inMemoryLinkRepository = new InMemoryLinkRepository();
    sut = new CreateLinkUseCase(inMemoryTripRepository, inMemoryLinkRepository);
  });

  it('should be able to create a link for a trip', async () => {
    const { tripsData } = await makeTripsInMemoryFactory(
      inMemoryTripRepository,
      inMemoryParticipantRepository
    );
    const tripId = tripsData[0].id;

    const createLinkDTO = {
      tripId,
      title: 'Visit the museum',
      url: 'https://www.museum.com',
    };

    const response = await sut.execute(createLinkDTO);

    expect(response).toEqual({ linkId: expect.any(String) });
  });

  it('should not be able to create a link for an unexistent trip', async () => {
    const createLinkDTO = {
      tripId: 'invalid-trip-id',
      title: 'Visit the museum',
      url: 'https://www.museum.com',
    };

    await expect(() => sut.execute(createLinkDTO)).rejects.toBeInstanceOf(
      TripNotFound
    );
  });
});
