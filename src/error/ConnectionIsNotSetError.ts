/**
 * Thrown when user tries to execute operation that requires connection to be established.
 */
export class ConnectionIsNotSetError extends Error {
  name = 'ConnectionIsNotSetError';

  constructor() {
    super();
    this.message = `Connection with database is not established. Check connection configuration.`;
  }
}
