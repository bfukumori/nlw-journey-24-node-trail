import { describe, expect, it } from 'vitest';
import { makeConfirmParticipantUseCase } from './makeConfirmParticipantUseCase.js';
import { ConfirmParticipantUseCase } from '@/useCases/ConfirmParticipantUseCase.js';

describe('makeConfirmParticipantUseCase', () => {
  it('should be able to create an instance of ConfirmParticipantUseCase', async () => {
    const confirmParticipantUseCaseInstance =
      await makeConfirmParticipantUseCase();

    expect(confirmParticipantUseCaseInstance).toBeInstanceOf(
      ConfirmParticipantUseCase
    );
  });
});
