import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InvalidDate } from '@/errors/InvalidDate.js';
import { CreateActivityDTORequest } from '@/repositories/dtos/createActivityDTO.js';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';
import { CreateActivityUseCase } from './CreateActivityUseCase.js';
import { CreateTripDTORequest } from '@/repositories/dtos/createTripDTO.js';
import { InMemoryActivityRepository } from '@/repositories/in-memory/InMemoryActivityRepository.js';
import { TripNotFound } from '@/errors/TripNotFound.js';

let inMemoryTripRepository: InMemoryTripRepository;
let inMemoryActivityRepository: InMemoryActivityRepository;
let sut: CreateActivityUseCase;
let createActivityDTO: CreateActivityDTORequest;
let createTripDTO: CreateTripDTORequest;

describe('CreateActivityUseCase', () => {
  beforeEach(async () => {
    inMemoryTripRepository = new InMemoryTripRepository();
    inMemoryActivityRepository = new InMemoryActivityRepository();
    sut = new CreateActivityUseCase(
      inMemoryTripRepository,
      inMemoryActivityRepository
    );

    vi.useFakeTimers();

    const date = new Date(2024, 6, 8, 19);

    vi.setSystemTime(date);

    createTripDTO = {
      destination: 'São Paulo',
      startsAt: new Date('2024-07-10'),
      endsAt: new Date('2024-07-17'),
      ownerName: 'John Doe',
      ownerEmail: 'johndoe@test.com',
      emailsToInvite: ['johndoe@test.com'],
    };

    const { tripId } = await inMemoryTripRepository.createTrip(createTripDTO);

    createActivityDTO = {
      title: 'Visit the museum',
      occursAt: new Date('2024-07-10'),
      tripId,
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to create an activity for a trip', async () => {
    const response = await sut.execute(createActivityDTO);

    expect(response).toEqual({ activityId: expect.any(String) });
  });

  it('should not be able to create an activity for an unexistent trip', async () => {
    createActivityDTO.tripId = 'invalid-trip-id';

    await expect(() => sut.execute(createActivityDTO)).rejects.toBeInstanceOf(
      TripNotFound
    );
  });

  it('should not be able to create an activity before trip start date', async () => {
    createActivityDTO.occursAt = new Date('2024-07-09');

    await expect(() => sut.execute(createActivityDTO)).rejects.toBeInstanceOf(
      InvalidDate
    );
  });

  it('should not be able to create an activity after trip end date', async () => {
    createActivityDTO.occursAt = new Date('2024-07-18');

    await expect(() => sut.execute(createActivityDTO)).rejects.toBeInstanceOf(
      InvalidDate
    );
  });
});
