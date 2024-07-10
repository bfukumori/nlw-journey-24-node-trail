import { describe, expect, it } from 'vitest';
import { makeGetLinksUseCase } from './makeGetLinksUseCase.js';
import { GetLinksUseCase } from '@/useCases/GetLinksUseCase.js';

describe('makeGetLinksUseCase', () => {
  it('should be able to create an instance of GetLinksUseCase', async () => {
    const getLinksUseCaseInstance = await makeGetLinksUseCase();

    expect(getLinksUseCaseInstance).toBeInstanceOf(GetLinksUseCase);
  });
});
