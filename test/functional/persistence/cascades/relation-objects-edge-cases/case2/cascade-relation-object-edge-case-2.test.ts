import { Connection } from '../../../../../../src/connection/Connection';
import { createTestingConnection, clearDatabase } from '../../../../../utils/test-utils';
import { Artist } from './entity/Artist';
import { Song } from './entity/Song';
import { Movie } from './entity/Movie';

const dbName = 'cascade-relation-object-edge-case-2';

let connection: Connection;
beforeAll(async () => (connection = await createTestingConnection(__dirname + '/entity/*.ts', dbName)));
afterEach(async () => await clearDatabase(connection, dbName));
afterAll(async () => await connection.close());

test('should remove everything by cascades properly except the relation that is also used in other entity', async () => {
  const artist = new Artist();
  artist.name = 'artist1';

  // Both the song and the movie are from the same artist

  const song = new Song();
  song.name = 'song1';
  song.artist = artist;

  const movie = new Movie();
  movie.name = 'movie1';
  movie.artist = artist;

  // We save both songs. Because cascade is set to true in the relation. Artist will also be saved.

  await connection.manager.save([song, movie]);

  const songFromDBBeforeRemove = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('song')
    .find()
    .toArray();

  expect(songFromDBBeforeRemove.length).toBe(1);

  const movieFromDBBeforeRemove = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('movie')
    .find()
    .toArray();

  expect(movieFromDBBeforeRemove.length).toBe(1);

  // We remove first song, but because artist1 needs to stay in db for song2, it should be still in db.

  await connection.manager.remove(song);

  const songFromDBAfterRemove = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('song')
    .find()
    .toArray();

  expect(songFromDBAfterRemove.length).toBe(0);

  const artistFromDB1 = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('artist')
    .find()
    .toArray();

  expect(artistFromDB1.length).toBe(1);
  expect(artistFromDB1[0].name).toBe('artist1');

  // After we deleted song2 artist should also be deleted, because of cascade.

  await connection.manager.remove(movie);

  const artistFromDB2 = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('artist')
    .find()
    .toArray();

  expect(artistFromDB2.length).toBe(0);
});
