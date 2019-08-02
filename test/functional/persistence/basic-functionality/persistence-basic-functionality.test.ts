import { Connection } from '../../../../src/connection/Connection';
import { User } from './entity/User';
import { clearDatabase, createTestingConnection } from '../../../utils/test-utils';
import { ObjectID } from 'bson';
import { Post } from './entity/Post';

const dbName = 'persistence-basic-functionality';

let connection: Connection;
beforeAll(async () => (connection = await createTestingConnection(__dirname + '/entity/*.ts', dbName)));
afterEach(async () => await clearDatabase(connection, dbName));
afterAll(async () => await connection.close());

test('should insert an entity when using save without object id field', async () => {
  const user = new User();
  user.name = 'test';
  user.age = 18;
  await connection.manager.save(user);
  const userFromDB = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('user')
    .find()
    .toArray();
  expect(userFromDB.length).toBe(1);
  expect(userFromDB[0].name).toBe(user.name);
  expect(userFromDB[0].age).toBe(user.age);
});

test('should set the object id field of entity after insert save', async () => {
  const user = new User();
  user.name = 'test';
  user.age = 18;
  await connection.manager.save(user);

  expect(user.id).toBeInstanceOf(ObjectID);
});

test('should update an entity when using save and the object id field is set', async () => {
  const user = new User();
  user.name = 'test';
  user.age = 18;
  await connection.manager.save(user);
  user.name = 'test2';
  user.age = 20;
  await connection.manager.save(user);
  const userFromDB = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('user')
    .find()
    .toArray();
  expect(userFromDB.length).toBe(1);
  expect(userFromDB[0].name).toBe(user.name);
  expect(userFromDB[0].age).toBe(user.age);
});

test('should delete an entity when using remove', async () => {
  const user = new User();
  user.name = 'test';
  user.age = 18;
  await connection.manager.save(user);
  const userFromDB1 = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('user')
    .find()
    .toArray();
  expect(userFromDB1.length).toBe(1);
  expect(userFromDB1[0].name).toBe(user.name);
  expect(userFromDB1[0].age).toBe(user.age);

  await connection.manager.remove(user);

  const userFromDB2 = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('user')
    .find()
    .toArray();
  expect(userFromDB2.length).toBe(0);
});
test('should throw an error when not an object is passed to a save method', async () => {
  await expect(connection.manager.save(undefined)).rejects.toThrow(
    `Cannot save, given value must be an entity, instead "undefined" is given.`
  );
  await expect(connection.manager.save(null)).rejects.toThrow(
    `Cannot save, given value must be an entity, instead "null" is given.`
  );
  await expect(connection.manager.save(123)).rejects.toThrow(
    `Cannot save, given value must be an entity, instead "123" is given.`
  );
});
test('should throw an error when not an object is passed to a remove method', async () => {
  await expect(connection.manager.remove(undefined)).rejects.toThrow(
    `Cannot remove, given value must be an entity, instead "undefined" is given.`
  );
  await expect(connection.manager.remove(null)).rejects.toThrow(
    `Cannot remove, given value must be an entity, instead "null" is given.`
  );
  await expect(connection.manager.remove(123)).rejects.toThrow(
    `Cannot remove, given value must be an entity, instead "123" is given.`
  );
});
test('should throw an exception if object literal is given instead of constructed entity because it cannot determine what to save', async () => {
  await expect(connection.manager.save({})).rejects.toThrow(
    `Cannot save, given value must be instance of entity class, instead object literal is given.`
  );
  await expect(connection.manager.remove({})).rejects.toThrow(
    `Cannot remove, given value must be instance of entity class, instead object literal is given.`
  );
  await expect(connection.manager.save([{}, {}])).rejects.toThrow(
    `Cannot save, given value must be instance of entity class, instead object literal is given.`
  );
  const user = new User();
  user.name = 'test';
  user.age = 18;
  await expect(connection.manager.save([user, {}])).rejects.toThrow(
    `Cannot save, given value must be instance of entity class, instead object literal is given.`
  );
  await expect(connection.manager.remove([{}, {}])).rejects.toThrow(
    `Cannot remove, given value must be instance of entity class, instead object literal is given.`
  );
  await expect(connection.manager.remove([user, {}])).rejects.toThrow(
    `Cannot remove, given value must be instance of entity class, instead object literal is given.`
  );
});
test('should be able to save and remove entities of different types', async () => {
  const post = new Post();
  post.name = 'test';
  post.text = 'Nice Text!';

  const user = new User();
  user.name = 'user';
  user.age = 18;

  await connection.manager.save([post, user]);
  const userFromDB = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('user')
    .find()
    .toArray();
  expect(userFromDB.length).toBe(1);
  expect(userFromDB[0].name).toBe(user.name);
  expect(userFromDB[0].age).toBe(user.age);

  const postFromDB = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('post')
    .find()
    .toArray();
  expect(postFromDB.length).toBe(1);
  expect(postFromDB[0].name).toBe(post.name);
  expect(postFromDB[0].text).toBe(post.text);

  await connection.manager.remove([post, user]);

  const userFromDB2 = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('user')
    .find()
    .toArray();
  expect(userFromDB2.length).toBe(0);

  const postFromDB2 = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('post')
    .find()
    .toArray();
  expect(postFromDB2.length).toBe(0);
});
