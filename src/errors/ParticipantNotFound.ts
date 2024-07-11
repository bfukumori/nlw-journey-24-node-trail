import { ClientError } from './client-error.js';

export class ParticipantNotFound extends ClientError {
  constructor() {
    super('Participant not found');
    this.name = 'ParticipantNotFound';
  }
}
