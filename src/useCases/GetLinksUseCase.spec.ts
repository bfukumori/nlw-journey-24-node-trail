import { beforeEach, describe, expect, it } from 'vitest';

import { TripNotFound } from '@/errors/TripNotFound.js';
import { makeTripsInMemoryFactory } from '@/factories/in-memory/makeTripsInMemoryFactory.ts.js';
import { InMemoryLinkRepository } from '@/repositories/in-memory/InMemoryLinkRepository.js';
import { InMemoryParticipantRepository } from '@/repositories/in-memory/InMemoryParticipantRepository.js';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';
import { GetLinksUseCase } from './GetLinksUseCase.js';

let inMemoryTripRepository: InMemoryTripRepository;
let inMemoryParticipantRepository: InMemoryParticipantRepository;
let inMemoryLinkRepository: InMemoryLinkRepository;
let sut: GetLinksUseCase;

describe('GetLinksUseCase', () => {
  beforeEach(async () => {
    inMemoryTripRepository = new InMemoryTripRepository();
    inMemoryParticipantRepository = new InMemoryParticipantRepository();
    inMemoryLinkRepository = new InMemoryLinkRepository();
    sut = new GetLinksUseCase(inMemoryTripRepository, inMemoryLinkRepository);
  });

  it('should be able to list all links created for a trip', async () => {
    const { tripsData } = await makeTripsInMemoryFactory(
      inMemoryTripRepository,
      inMemoryParticipantRepository
    );
    const tripId = tripsData[0].id;

    await inMemoryLinkRepository.createLink({
      title: 'Visit the museum',
      url: 'https://www.museum.com',
      tripId,
    });

    await inMemoryLinkRepository.createLink({
      title: 'Visit the aquarium',
      url: 'https://www.aquarium.com',
      tripId,
    });

    const response = await sut.execute(tripId);

    expect(response.links).toHaveLength(2);
  });

  it('should not be able to list links for an unexistent trip', async () => {
    await expect(() => sut.execute('unexistent id')).rejects.toBeInstanceOf(
      TripNotFound
    );
  });
});
