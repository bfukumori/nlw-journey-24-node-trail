import { beforeEach, describe, expect, it } from 'vitest';

import { makeTripsInMemoryFactory } from '@/factories/in-memory/makeTripsInMemoryFactory.ts.js';
import { InMemoryParticipantRepository } from '@/repositories/in-memory/InMemoryParticipantRepository.js';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';
import { GetParticipantsUseCase } from './GetParticipantsUseCase.js';

let inMemoryTripRepository: InMemoryTripRepository;
let inMemoryParticipantRepository: InMemoryParticipantRepository;
let sut: GetParticipantsUseCase;

describe('GetParticipantsUseCase', () => {
  beforeEach(async () => {
    inMemoryTripRepository = new InMemoryTripRepository();
    inMemoryParticipantRepository = new InMemoryParticipantRepository();
    sut = new GetParticipantsUseCase(inMemoryParticipantRepository);
  });

  it('should be able to list all participants for a trip', async () => {
    const { tripsData } = await makeTripsInMemoryFactory(
      inMemoryTripRepository,
      inMemoryParticipantRepository
    );
    const { participants } = await sut.execute(tripsData[0].id);

    expect(participants).toHaveLength(2);
  });
});
