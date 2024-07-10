import { ClientError } from './client-error.js';

export class TripNotFound extends ClientError {
  code: number;

  constructor() {
    super('Trip not found');
    this.name = 'TripNotFound';
    this.code = 422;
  }
}
