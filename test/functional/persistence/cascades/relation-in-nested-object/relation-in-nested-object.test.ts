import { Connection } from '../../../../../src/connection/Connection';
import { createTestingConnection, clearDatabase } from '../../../../utils/test-utils';
import { User } from './entity/User';
import { ObjectId } from 'bson';
import { Item } from './entity/Item';
import { Order } from './entity/Order';

const dbName = 'relation-in-nested-object';

let connection: Connection;
beforeAll(async () => connection = await createTestingConnection(__dirname + '/entity/*.ts', dbName));
//afterEach(async () => await clearDatabase(connection, dbName));
afterAll(async () => await connection.close());

test('should insert everything by cascades properly', async () => {
  const item1 = new Item();
  item1.name = 'item1';
  item1.price = 1.30;

  const item2 = new Item();
  item2.name = 'item2';
  item2.price = 1.50;

  const item3 = new Item();
  item3.name = 'item3';
  item3.price = 2.50;

  const order1 = new Order();
  order1.date = 1;
  order1.items = [item1, item2];

  const order2 = new Order();
  order2.date = 2;
  order2.items = [item3];

  const user = new User();
  user.orders = [order1, order2];

  await connection.manager.save(user);

  const itemsFromDB = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('item')
    .find()
    .toArray();

  expect(itemsFromDB.length).toBe(3);
});
