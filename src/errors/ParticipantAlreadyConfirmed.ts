import { ClientError } from './client-error.js';

export class ParticipantAlreadyConfirmed extends ClientError {
  constructor() {
    super('Participant already confirmed');
    this.name = 'ParticipantAlreadyConfirmed';
  }
}
