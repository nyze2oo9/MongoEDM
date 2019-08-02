/**
 * Thrown when consumer tries to connect when he already connected.
 */
export class CannotConnectAlreadyConnectedError extends Error {
  name = 'CannotConnectAlreadyConnectedError';

  constructor() {
    super();
    this.message = `Cannot create a connection because connection to the database already established.`;
  }
}
