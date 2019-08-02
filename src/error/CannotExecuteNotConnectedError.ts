/**
 * Thrown when consumer tries to execute operation allowed only if connection is opened.
 */
export class CannotExecuteNotConnectedError extends Error {
  name = 'CannotExecuteNotConnectedError';

  constructor() {
    super();
    this.message = `Cannot execute operation on connection because connection is not yet established.`;
  }
}
