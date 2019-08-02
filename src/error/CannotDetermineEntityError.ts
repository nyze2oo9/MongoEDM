/**
 * Thrown when user tries to save/remove/etc. constructor-less object (object literal) instead of entity.
 */
export class CannotDetermineEntityError extends Error {
  name = 'CannotDetermineEntityError';

  constructor(operation: string) {
    super();
    this.message = `Cannot ${operation}, given value must be instance of entity class, instead object literal is given.`;
  }
}
