import { ClientError } from './client-error.js';

export class TripNotFound extends ClientError {
  constructor() {
    super('Trip not found');
    this.name = 'TripNotFound';
  }
}
