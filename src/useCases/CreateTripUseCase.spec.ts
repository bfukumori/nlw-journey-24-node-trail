import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InvalidDate } from '@/errors/InvalidDate.js';
import { CreateTripDTORequest } from '@/repositories/dtos/createTripDTO.js';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';
import { CreateTripUseCase } from './CreateTripUseCase.js';

let inMemoryTripRepository: InMemoryTripRepository;
let sut: CreateTripUseCase;
let createTripDTO: CreateTripDTORequest;

describe('CreateTripUseCase', () => {
  beforeEach(async () => {
    inMemoryTripRepository = new InMemoryTripRepository();
    sut = new CreateTripUseCase(inMemoryTripRepository);

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

  it('should be able to create a new trip', async () => {
    const response = await sut.execute(createTripDTO);

    expect(response).toEqual({ tripId: expect.any(String) });
  });

  it('should not be able to create a new trip with invalid start date', async () => {
    createTripDTO.startsAt = new Date('2024-06-10');

    await expect(() => sut.execute(createTripDTO)).rejects.toBeInstanceOf(
      InvalidDate
    );
  });

  it('should not be able to create a new trip with invalid end date', async () => {
    createTripDTO.endsAt = new Date('2024-06-11');

    await expect(() => sut.execute(createTripDTO)).rejects.toBeInstanceOf(
      InvalidDate
    );
  });
});
