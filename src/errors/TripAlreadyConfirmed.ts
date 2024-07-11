import { ClientError } from './client-error.js';

export class TripAlreadyConfirmed extends ClientError {
  constructor() {
    super('Trip already confirmed');
    this.name = 'TripAlreadyConfirmed';
  }
}
