export class InvalidDate extends Error {
  code: number;

  constructor(message: string) {
    super(message);
    this.name = 'InvalidDate';
    this.code = 400;
  }
}
