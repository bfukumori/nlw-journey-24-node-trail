import { describe, expect, it } from 'vitest';
import { CreateActivityUseCase } from '@/useCases/CreateActivityUseCase.js';
import { makeCreateActivityUseCase } from './makeCreateActivityUseCase.js';

describe('makeCreateActivityUseCase', () => {
  it('should be able to create an instance of CreateActivityUseCase', async () => {
    const createActivityUseCaseInstance = await makeCreateActivityUseCase();

    expect(createActivityUseCaseInstance).toBeInstanceOf(CreateActivityUseCase);
  });
});
