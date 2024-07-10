import { GetActivitiesUseCase } from '@/useCases/GetActivitiesUseCase.js';
import { describe, expect, it } from 'vitest';
import { makeGetActivitiesUseCase } from './makeGetActivitiesUseCase.js';

describe('makeGetActivitiesUseCase', () => {
  it('should be able to create an instance of GetActivitiesUseCase', async () => {
    const getActivitiesUseCaseInstance = await makeGetActivitiesUseCase();

    expect(getActivitiesUseCaseInstance).toBeInstanceOf(GetActivitiesUseCase);
  });
});
