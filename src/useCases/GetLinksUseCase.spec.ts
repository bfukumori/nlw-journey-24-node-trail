import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateTripDTORequest } from '@/repositories/dtos/createTripDTO.js';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';
import { GetLinksUseCase } from './GetLinksUseCase.js';
import { InMemoryLinkRepository } from '@/repositories/in-memory/InMemoryLinkRepository.js';
import { TripNotFound } from '@/errors/TripNotFound.js';

let inMemoryTripRepository: InMemoryTripRepository;
let inMemoryLinkRepository: InMemoryLinkRepository;
let sut: GetLinksUseCase;
let createTripDTO: CreateTripDTORequest;

describe('GetLinksUseCase', () => {
  beforeEach(async () => {
    inMemoryTripRepository = new InMemoryTripRepository();
    inMemoryLinkRepository = new InMemoryLinkRepository();
    sut = new GetLinksUseCase(inMemoryTripRepository, inMemoryLinkRepository);

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

  it('should be able to list all links created for a trip', async () => {
    const { tripId } = await inMemoryTripRepository.createTrip(createTripDTO);

    await inMemoryLinkRepository.createLink({
      title: 'Visit the museum',
      url: 'https://www.museum.com',
      tripId,
    });

    await inMemoryLinkRepository.createLink({
      title: 'Visit the aquarium',
      url: 'https://www.aquarium.com',
      tripId,
    });

    const response = await sut.execute(tripId);

    expect(response.links).toHaveLength(2);
  });

  it('should not be able to list links for an unexistent trip', async () => {
    await expect(() => sut.execute('unexistent id')).rejects.toBeInstanceOf(
      TripNotFound
    );
  });
});
