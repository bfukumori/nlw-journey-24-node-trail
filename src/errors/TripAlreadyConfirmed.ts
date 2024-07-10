export class TripAlreadyConfirmed extends Error {
  code: number;

  constructor() {
    super('Trip already confirmed');
    this.name = 'TripAlreadyConfirmed';
    this.code = 422;
  }
}
