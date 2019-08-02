import { Connection } from '../../../../../src/connection/Connection';
import { createTestingConnection, clearDatabase } from '../../../../utils/test-utils';
import { User } from './entity/User';
import { ObjectId } from 'bson';
import { Question } from './entity/Question';
import { Answer } from './entity/Answer';

const dbName = 'cascade-nested-array';

let connection: Connection;
beforeAll(async () => connection = await createTestingConnection(__dirname + '/entity/*.ts', dbName));
afterEach(async () => await clearDatabase(connection, dbName));
afterAll(async () => await connection.close());

test('should insert everything by cascades properly', async () => {
  const user1 = new User();
  user1.username = 'user1';

  const user2 = new User();
  user2.username = 'user2';

  const user3 = new User();
  user3.username = 'user3';

  const answer1 = new Answer();
  answer1.text = 'Use Nesting instead of Referencing.';
  answer1.user = user2;

  const answer2 = new Answer();
  answer2.text = 'Think about 16MB max document size.';
  answer2.user = user3;

  const question = new Question();
  question.text = 'How does Mongo DB work?';
  question.user = user1;
  question.answers = [answer1, answer2];

  await connection.manager.save(question);

  const questionFromDB = await connection.driver.queryRunner.databaseConnection
    .db(dbName)
    .collection('question')
    .find()
    .toArray();

  expect(questionFromDB[0]._id).toBeInstanceOf(ObjectId);
  expect(questionFromDB[0]).toMatchObject({
    text: 'How does Mongo DB work?',
    user: {
      username: 'user1'
    },
    answers: [
      {
        text: 'Use Nesting instead of Referencing.',
        user: {
          username: 'user2'
        }
      },
      {
        text: 'Think about 16MB max document size.',
        user: {
          username: 'user3'
        }
      }
    ]
  });
});
