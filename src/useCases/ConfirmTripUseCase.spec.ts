import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TripNotFound } from '@/errors/TripNotFound.js';
import { CreateTripDTORequest } from '@/repositories/dtos/createTripDTO.js';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';
import { ConfirmTripUseCase } from './ConfirmTripUseCase.js';
import { TripAlreadyConfirmed } from '@/errors/TripAlreadyConfirmed.js';

let inMemoryTripRepository: InMemoryTripRepository;
let sut: ConfirmTripUseCase;
let createTripDTO: CreateTripDTORequest;

describe('ConfirmTripUseCase', () => {
  beforeEach(() => {
    inMemoryTripRepository = new InMemoryTripRepository();
    sut = new ConfirmTripUseCase(inMemoryTripRepository);

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

  it('should be able to confirm a trip', async () => {
    const { tripId } = await inMemoryTripRepository.createTrip(createTripDTO);

    await sut.execute(tripId);

    const trip = await inMemoryTripRepository.findTripById(tripId);

    expect(trip).toEqual({ ...trip, isConfirmed: true });
  });

  it('should not be able to confirm an inexistent trip', async () => {
    await inMemoryTripRepository.createTrip(createTripDTO);

    await expect(() => sut.execute('invalid id')).rejects.toBeInstanceOf(
      TripNotFound
    );
  });

  it('should not be able to confirm an already confirmed trip', async () => {
    const { tripId } = await inMemoryTripRepository.createTrip(createTripDTO);
    await inMemoryTripRepository.confirmTrip(tripId);

    await expect(() => sut.execute(tripId)).rejects.toBeInstanceOf(
      TripAlreadyConfirmed
    );
  });
});
