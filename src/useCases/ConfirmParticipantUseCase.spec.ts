import { beforeEach, describe, expect, it } from 'vitest';

import { ParticipantAlreadyConfirmed } from '@/errors/ParticipantAlreadyConfirmed.js';
import { ParticipantNotFound } from '@/errors/ParticipantNotFound.js';
import { makeTripsInMemoryFactory } from '@/factories/in-memory/makeTripsInMemoryFactory.ts.js';
import { InMemoryParticipantRepository } from '@/repositories/in-memory/InMemoryParticipantRepository.js';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';
import { ConfirmParticipantUseCase } from './ConfirmParticipantUseCase.js';

let inMemoryTripRepository: InMemoryTripRepository;
let inMemoryParticipantRepository: InMemoryParticipantRepository;
let sut: ConfirmParticipantUseCase;

describe('ConfirmParticipantUseCase', () => {
  beforeEach(() => {
    inMemoryTripRepository = new InMemoryTripRepository();
    inMemoryParticipantRepository = new InMemoryParticipantRepository();
    sut = new ConfirmParticipantUseCase(inMemoryParticipantRepository);
  });

  it('should be able to confirm a participant', async () => {
    const { participantsData } = await makeTripsInMemoryFactory(
      inMemoryTripRepository,
      inMemoryParticipantRepository
    );
    const participantId = participantsData[1].id;

    const { isConfirmed } = await sut.execute(participantId);

    expect(isConfirmed).toBe(true);
  });

  it('should not be able to confirm an inexistent trip', async () => {
    await expect(() => sut.execute('invalid id')).rejects.toBeInstanceOf(
      ParticipantNotFound
    );
  });

  it('should not be able to confirm an already confirmed trip', async () => {
    const { participantsData } = await makeTripsInMemoryFactory(
      inMemoryTripRepository,
      inMemoryParticipantRepository
    );
    const participantId = participantsData[0].id;

    await expect(() => sut.execute(participantId)).rejects.toBeInstanceOf(
      ParticipantAlreadyConfirmed
    );
  });
});
