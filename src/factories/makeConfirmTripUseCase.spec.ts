import { describe, expect, it } from 'vitest';
import { makeConfirmTripUseCase } from './makeConfirmTripUseCase.js';
import { ConfirmTripUseCase } from '@/useCases/ConfirmTripUseCase.js';

describe('makeConfirmTripUseCase', () => {
  it('should be able to create an instance of ConfirmTripUseCase', async () => {
    const confirmTripUseCaseInstance = await makeConfirmTripUseCase();

    expect(confirmTripUseCaseInstance).toBeInstanceOf(ConfirmTripUseCase);
  });
});
