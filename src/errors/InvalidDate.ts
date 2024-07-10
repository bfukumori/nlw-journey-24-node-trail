import { ClientError } from './client-error.js';

export class InvalidDate extends ClientError {
  code: number;

  constructor(message: string) {
    super(message);
    this.name = 'InvalidDate';
    this.code = 400;
  }
}
