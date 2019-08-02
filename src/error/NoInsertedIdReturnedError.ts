/**
 * Thrown when consumer tries to connect when he already connected.
 */
export class NoInsertedIdReturnedError extends Error {
  name = 'NoInsertedIdReturnedError';

  constructor() {
    super();
    this.message = `MongoDB did not return insertedId.`;
  }
}
