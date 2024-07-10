import { ClientError } from './client-error.js';

export class TripAlreadyConfirmed extends ClientError {
  code: number;

  constructor() {
    super('Trip already confirmed');
    this.name = 'TripAlreadyConfirmed';
    this.code = 422;
  }
}
