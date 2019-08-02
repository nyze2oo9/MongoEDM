import { Connection } from '../../../../../src/connection/Connection';
import { createTestingConnection, clearDatabase } from '../../../../utils/test-utils';
import { Photo } from './entity/Photo';
import { Profile } from './entity/Profile';
import { User } from './entity/User';
import { ObjectId } from 'bson';

const dbName = 'cascade-nested-object';

let connection: Connection;
beforeAll(async () => connection = await createTestingConnection(__dirname + '/entity/*.ts', dbName));
afterEach(async () => await clearDatabase(connection, dbName));
afterAll(async () => await connection.close());

test('should insert everything by cascades properly', async () => {
  const photo = new Photo();
  photo.path = './path/to/photo';

  const profile = new Profile();
  profile.photo = photo;

  const user = new User();
  user.profile = profile;

  await connection.manager.save(user);

  const userFromDB = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('user')
    .find()
    .toArray();

  expect(userFromDB[0]._id).toBeInstanceOf(ObjectId);
  expect(userFromDB[0].profile.photo.path).toBe('./path/to/photo');
});
