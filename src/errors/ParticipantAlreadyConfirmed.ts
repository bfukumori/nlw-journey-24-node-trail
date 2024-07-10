export class ParticipantAlreadyConfirmed extends Error {
  code: number;

  constructor() {
    super('Participant already confirmed');
    this.name = 'ParticipantAlreadyConfirmed';
    this.code = 422;
  }
}
