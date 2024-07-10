import { ClientError } from './client-error.js';

export class ParticipantAlreadyConfirmed extends ClientError {
  code: number;

  constructor() {
    super('Participant already confirmed');
    this.name = 'ParticipantAlreadyConfirmed';
    this.code = 422;
  }
}
