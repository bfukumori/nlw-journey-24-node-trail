import { beforeEach, describe, expect, it } from 'vitest';

import { ParticipantNotFound } from '@/errors/ParticipantNotFound.js';
import { makeTripsInMemoryFactory } from '@/factories/in-memory/makeTripsInMemoryFactory.ts.js';
import { InMemoryParticipantRepository } from '@/repositories/in-memory/InMemoryParticipantRepository.js';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';
import { GetParticipantDetailsUseCase } from './GetParticipantDetailsUseCase.js';

let inMemoryTripRepository: InMemoryTripRepository;
let inMemoryParticipantRepository: InMemoryParticipantRepository;
let sut: GetParticipantDetailsUseCase;

describe('GetParticipantDetailsUseCase', () => {
  beforeEach(() => {
    inMemoryTripRepository = new InMemoryTripRepository();
    inMemoryParticipantRepository = new InMemoryParticipantRepository();
    sut = new GetParticipantDetailsUseCase(inMemoryParticipantRepository);
  });

  it('should be able to get details of a participant', async () => {
    const { participantsData } = await makeTripsInMemoryFactory(
      inMemoryTripRepository,
      inMemoryParticipantRepository
    );
    const participant = await sut.execute(participantsData[0].id);

    expect(participant).toEqual(participantsData[0]);
  });

  it('should not be able to get details of an inexistent participant', async () => {
    await makeTripsInMemoryFactory(
      inMemoryTripRepository,
      inMemoryParticipantRepository
    );

    await expect(() => sut.execute('invalid id')).rejects.toBeInstanceOf(
      ParticipantNotFound
    );
  });
});
