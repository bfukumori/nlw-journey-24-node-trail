import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateTripDTORequest } from '@/repositories/dtos/createTripDTO.js';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';
import { ConfirmParticipantUseCase } from './ConfirmParticipantUseCase.js';
import { ParticipantNotFound } from '@/errors/ParticipantNotFound.js';
import { ParticipantAlreadyConfirmed } from '@/errors/ParticipantAlreadyConfirmed.js';

let inMemoryTripRepository: InMemoryTripRepository;
let sut: ConfirmParticipantUseCase;
let createTripDTO: CreateTripDTORequest;

describe('ConfirmParticipantUseCase', () => {
  beforeEach(() => {
    inMemoryTripRepository = new InMemoryTripRepository();
    sut = new ConfirmParticipantUseCase(inMemoryTripRepository);

    vi.useFakeTimers();

    const date = new Date(2024, 6, 8, 19);

    vi.setSystemTime(date);

    createTripDTO = {
      destination: 'São Paulo',
      startsAt: new Date('2024-07-10'),
      endsAt: new Date('2024-07-11'),
      ownerName: 'John Doe',
      ownerEmail: 'johndoe@test.com',
      emailsToInvite: ['johndoe@test.com'],
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to confirm a participant', async () => {
    const { tripId } = await inMemoryTripRepository.createTrip(createTripDTO);

    const trip = await inMemoryTripRepository.findTripById(tripId);
    const { id } = await sut.execute(trip!.participants[1].id);

    const participant = await inMemoryTripRepository.findParticipantById(id);

    expect(participant?.isConfirmed).toBe(true);
  });

  it('should not be able to confirm an inexistent trip', async () => {
    await inMemoryTripRepository.createTrip(createTripDTO);

    await expect(() => sut.execute('invalid id')).rejects.toBeInstanceOf(
      ParticipantNotFound
    );
  });

  it('should not be able to confirm an already confirmed trip', async () => {
    const { tripId } = await inMemoryTripRepository.createTrip(createTripDTO);

    const trip = await inMemoryTripRepository.findTripById(tripId);

    await expect(() =>
      sut.execute(trip!.participants[0].id)
    ).rejects.toBeInstanceOf(ParticipantAlreadyConfirmed);
  });
});
