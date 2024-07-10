import { describe, expect, it } from 'vitest';
import { CreateLinkUseCase } from '@/useCases/CreateLinkUseCase.js';
import { makeCreateLinkUseCase } from './makeCreateLinkUseCase.js';

describe('makeCreateLinkUseCase', () => {
  it('should be able to create an instance of CreateLinkUseCase', async () => {
    const createLinkUseCaseInstance = await makeCreateLinkUseCase();

    expect(createLinkUseCaseInstance).toBeInstanceOf(CreateLinkUseCase);
  });
});
