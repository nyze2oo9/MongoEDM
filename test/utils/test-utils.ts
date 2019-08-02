import { Connection } from '../../src/connection/Connection';
import { createConnection } from '../../src';

export function createTestingConnection(path: string, dbName: string) {
  return new Connection({
    uri: `mongodb://localhost:27017,localhost:27018,localhost:27019/${dbName}?replicaSet=rs`,
    entities: [path]
  }).connect();
}

export async function clearDatabase(connection: Connection, dbName: string) {
  const collectionNames = await connection.driver.queryRunner.databaseConnection.db(dbName).listCollections().toArray();
  const dropPromises = [];
  collectionNames.forEach(collectionInfo =>
    dropPromises.push(
      connection.driver.queryRunner.databaseConnection
        .db(dbName)
        .collection(collectionInfo.name)
        .drop()
    )
  );
  await Promise.all(dropPromises);
}
