import { Connection } from '../../../../../src/connection/Connection';
import { createTestingConnection, clearDatabase } from '../../../../utils/test-utils';
import { Photo } from './entity/Photo';
import { Profile } from './entity/Profile';
import { User } from './entity/User';
import { ObjectId } from 'bson';

const dbName = 'cascade-relation-object';

let connection: Connection;
beforeAll(async () => (connection = await createTestingConnection(__dirname + '/entity/*.ts', dbName)));
afterEach(async () => await clearDatabase(connection, dbName));
afterAll(async () => await connection.close());

test('should insert everything by cascades properly', async () => {
  const photo = new Photo();
  photo.path = './path/to/photo';

  const profile = new Profile();
  profile.username = 'user1';
  profile.photo = photo;

  const user = new User();
  user.password = 'secretpassword';
  user.profile = profile;

  await connection.manager.save(user);

  const userFromDB = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('user')
    .find()
    .toArray();

  const profileFromDB = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('profile')
    .find({ _id: new ObjectId(userFromDB[0].profile) })
    .toArray();

  const photoFromDB = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('photo')
    .find({ _id: new ObjectId(profileFromDB[0].photo) })
    .toArray();

  expect(userFromDB[0]._id).toBeInstanceOf(ObjectId);
  expect(userFromDB[0].password).toBe('secretpassword');
  expect(userFromDB[0].profile).toBeInstanceOf(ObjectId);

  expect(profileFromDB[0]._id).toBeInstanceOf(ObjectId);
  expect(profileFromDB[0].username).toBe('user1');
  expect(profileFromDB[0].photo).toBeInstanceOf(ObjectId);

  expect(photoFromDB[0]._id).toBeInstanceOf(ObjectId);
  expect(photoFromDB[0].path).toBe('./path/to/photo');
});
test('should remove everything by cascades properly', async () => {
  const photo = new Photo();
  photo.path = './path/to/photo';

  const profile = new Profile();
  profile.username = 'user1';
  profile.photo = photo;

  const user = new User();
  user.password = 'secretpassword';
  user.profile = profile;

  await connection.manager.save(user);
  await connection.manager.remove(user);

  const userFromDB = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('user')
    .find()
    .toArray();

  const profileFromDB = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('profile')
    .find()
    .toArray();

  const photoFromDB = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('photo')
    .find()
    .toArray();

  expect(userFromDB.length).toBe(0);

  expect(profileFromDB.length).toBe(0);

  expect(photoFromDB.length).toBe(0);
});