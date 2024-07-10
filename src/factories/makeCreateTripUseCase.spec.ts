import { describe, expect, it } from 'vitest';
import { makeCreateTripUseCase } from './makeCreateTripUseCase.js';
import { CreateTripUseCase } from '@/useCases/CreateTripUseCase.js';

describe('makeCreateTripUseCase', () => {
  it('should be able to create an instance of CreateTripUseCase', async () => {
    const createTripUseCaseInstance = await makeCreateTripUseCase();

    expect(createTripUseCaseInstance).toBeInstanceOf(CreateTripUseCase);
  });
});
