import { ClientError } from './client-error.js';

export class ParticipantNotFound extends ClientError {
  code: number;

  constructor() {
    super('Participant not found');
    this.name = 'ParticipantNotFound';
    this.code = 422;
  }
}
