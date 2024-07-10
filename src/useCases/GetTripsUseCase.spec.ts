import { beforeEach, describe, expect, it } from 'vitest';

import { makeTripsInMemoryFactory } from '@/factories/in-memory/makeTripsInMemoryFactory.ts.js';
import { InMemoryParticipantRepository } from '@/repositories/in-memory/InMemoryParticipantRepository.js';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';
import { GetTripsUseCase } from './GetTripsUseCase.js';

let inMemoryTripRepository: InMemoryTripRepository;
let inMemoryParticipantRepository: InMemoryParticipantRepository;
let sut: GetTripsUseCase;

describe('GetTripsUseCase', () => {
  beforeEach(async () => {
    inMemoryTripRepository = new InMemoryTripRepository();
    inMemoryParticipantRepository = new InMemoryParticipantRepository();
    sut = new GetTripsUseCase(inMemoryTripRepository);

    for (let i = 0; i < 12; i++) {
      await makeTripsInMemoryFactory(
        inMemoryTripRepository,
        inMemoryParticipantRepository
      );
    }
  });

  it('should be able to list all trips', async () => {
    const { total } = await sut.execute();
    expect(total).toBe(12);
  });

  it('should be able to list paginated trips', async () => {
    const { trips } = await sut.execute(2);
    expect(trips.length).toBe(2);
  });
});
