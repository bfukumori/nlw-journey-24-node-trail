export class ParticipantNotFound extends Error {
  code: number;

  constructor() {
    super('Participant not found');
    this.name = 'ParticipantNotFound';
    this.code = 422;
  }
}
