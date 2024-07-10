import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateTripDTORequest } from '@/repositories/dtos/createTripDTO.js';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';
import { GetActivitiesUseCase } from './GetActivitiesUseCase.js';
import { InMemoryActivityRepository } from '@/repositories/in-memory/InMemoryActivityRepository.js';
import { TripNotFound } from '@/errors/TripNotFound.js';

let inMemoryTripRepository: InMemoryTripRepository;
let inMemoryActivityRepository: InMemoryActivityRepository;
let sut: GetActivitiesUseCase;
let createTripDTO: CreateTripDTORequest;

describe('GetActivitiesUseCase', () => {
  beforeEach(async () => {
    inMemoryTripRepository = new InMemoryTripRepository();
    inMemoryActivityRepository = new InMemoryActivityRepository();
    sut = new GetActivitiesUseCase(
      inMemoryTripRepository,
      inMemoryActivityRepository
    );

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

  it('should be able to list all activities created for a trip', async () => {
    const { tripId } = await inMemoryTripRepository.createTrip(createTripDTO);

    await inMemoryActivityRepository.createActivity({
      title: 'Visit the museum',
      occursAt: new Date('2024-07-10'),
      tripId,
    });

    await inMemoryActivityRepository.createActivity({
      title: 'Visit the aquarium',
      occursAt: new Date('2024-07-12'),
      tripId,
    });

    const response = await sut.execute(tripId);

    expect(response.activities).toHaveLength(2);
  });

  it('should not be able to list activities for an unexistent trip', async () => {
    await expect(() => sut.execute('unexistent id')).rejects.toBeInstanceOf(
      TripNotFound
    );
  });
});
