export class TripNotFound extends Error {
  code: number;

  constructor() {
    super('Trip not found');
    this.name = 'TripNotFound';
    this.code = 422;
  }
}
