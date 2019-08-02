import { Connection } from '../../../../../../src/connection/Connection';
import { createTestingConnection, clearDatabase } from '../../../../../utils/test-utils';
import { Artist } from './entity/Artist';
import { Song } from './entity/Song';

const dbName = 'cascade-relation-object-edge-case-1';

let connection: Connection;
beforeAll(async () => (connection = await createTestingConnection(__dirname + '/entity/*.ts', dbName)));
afterEach(async () => await clearDatabase(connection, dbName));
afterAll(async () => await connection.close());

test('should remove everything by cascades properly except the relation that is also used in other entity', async () => {
  const artist = new Artist();
  artist.name = 'artist1';

  // Both songs are from the same artist

  const song1 = new Song();
  song1.name = 'song1';
  song1.artist = artist;

  const song2 = new Song();
  song2.name = 'song2';
  song2.artist = artist;

  // We save both songs. Because cascade is set to true in the relation. Artist will also be saved.

  await connection.manager.save([song1, song2]);

  const songFromDBBeforeRemove = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('song')
    .find()
    .toArray();

  expect(songFromDBBeforeRemove.length).toBe(2);

  // We remove first song, but because artist1 needs to stay in db for song2, it should be still in db.

  await connection.manager.remove(song1);

  const songFromDBAfterRemove = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('song')
    .find()
    .toArray();

  expect(songFromDBAfterRemove.length).toBe(1);
  expect(songFromDBAfterRemove[0].name).toBe('song2');

  const artistFromDB1 = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('artist')
    .find()
    .toArray();

  expect(artistFromDB1.length).toBe(1);
  expect(artistFromDB1[0].name).toBe('artist1');

  // After we deleted song2 artist should also be deleted, because of cascade.

  await connection.manager.remove(song2);

  const artistFromDB2 = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('artist')
    .find()
    .toArray();

  expect(artistFromDB2.length).toBe(0);
});
