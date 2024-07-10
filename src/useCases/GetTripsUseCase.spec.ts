import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateTripDTORequest } from '@/repositories/dtos/createTripDTO.js';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';
import { GetTripsUseCase } from './GetTripsUseCase.js';

let inMemoryTripRepository: InMemoryTripRepository;
let sut: GetTripsUseCase;
let createTripDTO: CreateTripDTORequest;

describe('GetTripsUseCase', () => {
  beforeEach(async () => {
    inMemoryTripRepository = new InMemoryTripRepository();
    sut = new GetTripsUseCase(inMemoryTripRepository);

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

    for (let i = 0; i < 12; i++) {
      await inMemoryTripRepository.createTrip(createTripDTO);
    }
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to list all trips', async () => {
    const { total } = await sut.execute();
    expect(total).toBe(12);
  });

  it('should be able to list paginated trips', async () => {
    const { trips } = await sut.execute(2);
    expect(trips.length).toBe(2);
  });
});
