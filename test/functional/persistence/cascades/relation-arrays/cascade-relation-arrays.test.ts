import { Connection } from '../../../../../src/connection/Connection';
import { createTestingConnection, clearDatabase } from '../../../../utils/test-utils';
import { Artist } from './entity/Artist';
import { Song } from './entity/Song';

const dbName = 'cascade-relation-arrays';

let connection: Connection;
beforeAll(async () => (connection = await createTestingConnection(__dirname + '/entity/*.ts', dbName)));
afterEach(async () => await clearDatabase(connection, dbName));
afterAll(async () => await connection.close());

test('should remove everything by cascades properly except the relation that is also used in other entity', async () => {
  const artist1 = new Artist();
  artist1.name = 'artist1';

  const artist2 = new Artist();
  artist2.name = 'artist2';

  const song = new Song();
  song.name = 'song1';
  song.artists = [artist1, artist2];

  await connection.manager.save(song);

  const songFromDB = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('song')
    .find()
    .toArray();

  expect(songFromDB.length).toBe(1);
  expect(songFromDB[0].name).toBe('song1');
  expect(songFromDB[0].artists.length).toBe(2);
});
