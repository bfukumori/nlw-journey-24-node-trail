import { describe, expect, it } from 'vitest';
import { makeGetTripsUseCase } from './makeGetTripsUseCase.js';
import { GetTripsUseCase } from '@/useCases/GetTripsUseCase.js';

describe('makeGetTripsUseCase', () => {
  it('should be able to create an instance of GetTripsUseCase', async () => {
    const getTripsUseCaseInstance = await makeGetTripsUseCase();

    expect(getTripsUseCaseInstance).toBeInstanceOf(GetTripsUseCase);
  });
});
