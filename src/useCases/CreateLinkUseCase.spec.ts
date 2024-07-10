import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';
import { CreateTripDTORequest } from '@/repositories/dtos/createTripDTO.js';
import { TripNotFound } from '@/errors/TripNotFound.js';
import { CreateLinkUseCase } from './CreateLinkUseCase.js';
import { InMemoryLinkRepository } from '@/repositories/in-memory/InMemoryLinkRepository.js';

let inMemoryTripRepository: InMemoryTripRepository;
let inMemoryLinkRepository: InMemoryLinkRepository;
let sut: CreateLinkUseCase;
let createTripDTO: CreateTripDTORequest;

describe('CreateLinkUseCase', () => {
  beforeEach(async () => {
    inMemoryTripRepository = new InMemoryTripRepository();
    inMemoryLinkRepository = new InMemoryLinkRepository();
    sut = new CreateLinkUseCase(inMemoryTripRepository, inMemoryLinkRepository);

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
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to create a link for a trip', async () => {
    const { tripId } = await inMemoryTripRepository.createTrip(createTripDTO);

    const createLinkDTO = {
      tripId,
      title: 'Visit the museum',
      url: 'https://www.museum.com',
    };

    const response = await sut.execute(createLinkDTO);

    expect(response).toEqual({ linkId: expect.any(String) });
  });

  it('should not be able to create a link for an unexistent trip', async () => {
    const createLinkDTO = {
      tripId: 'invalid-trip-id',
      title: 'Visit the museum',
      url: 'https://www.museum.com',
    };

    await expect(() => sut.execute(createLinkDTO)).rejects.toBeInstanceOf(
      TripNotFound
    );
  });
});
