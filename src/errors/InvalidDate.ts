import { ClientError } from './client-error.js';

export class InvalidDate extends ClientError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidDate';
  }
}
