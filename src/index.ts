import { getFromContainer } from './container';
import { IConnectionOptions } from './connection/IConnectionOptions';
import { Connection } from './connection/Connection';
import { MetadataArgsStorage } from './metadata-args/MetadataArgsStorage';
import { Entity } from './decorators/Entity';

export { ChildEntity } from './decorators/child-entity.decorator';
export { Entity } from './decorators/Entity';
export { Field } from './decorators/Field';

/**
 * Creates a new connection and registers it in the manager.
 */
export async function createConnection(options: IConnectionOptions): Promise<Connection> {
  return getFromContainer(Connection, c => new Connection(options)).connect();
}

/**
 * Gets metadata args storage.
 */
export function getMetadataArgsStorage(): MetadataArgsStorage {
  return getFromContainer(MetadataArgsStorage, c => new MetadataArgsStorage());
}
