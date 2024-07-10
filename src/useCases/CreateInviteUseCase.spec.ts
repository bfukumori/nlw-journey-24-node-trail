import { beforeEach, describe, expect, it } from 'vitest';

import { TripNotFound } from '@/errors/TripNotFound.js';
import { makeTripsInMemoryFactory } from '@/factories/in-memory/makeTripsInMemoryFactory.ts.js';
import { CreateInviteDTORequest } from '@/repositories/dtos/createInviteDTO.js';
import { InMemoryParticipantRepository } from '@/repositories/in-memory/InMemoryParticipantRepository.js';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';
import { CreateInviteUseCase } from './CreateInviteUseCase.js';

let inMemoryTripRepository: InMemoryTripRepository;
let inMemoryParticipantRepository: InMemoryParticipantRepository;
let sut: CreateInviteUseCase;

describe('CreateInviteUseCase', () => {
  beforeEach(async () => {
    inMemoryTripRepository = new InMemoryTripRepository();
    inMemoryParticipantRepository = new InMemoryParticipantRepository();
    sut = new CreateInviteUseCase(
      inMemoryTripRepository,
      inMemoryParticipantRepository
    );
  });

  it('should be able to create a invite for a trip', async () => {
    const { tripsData, participantsData } = await makeTripsInMemoryFactory(
      inMemoryTripRepository,
      inMemoryParticipantRepository
    );
    const tripId = tripsData[0].id;

    const createInviteDTO: CreateInviteDTORequest = {
      tripId,
      email: 'new_guest@test.com',
    };

    await sut.execute(createInviteDTO);

    expect(participantsData).toHaveLength(tripsData[0].participants.length + 1);
  });

  it('should not be able to create a invite for an unexistent trip', async () => {
    const createInviteDTO = {
      tripId: 'invalid-trip-id',
      email: 'new_guest@test.com',
    };

    await expect(() => sut.execute(createInviteDTO)).rejects.toBeInstanceOf(
      TripNotFound
    );
  });
});
