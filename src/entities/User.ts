import { Field } from '../decorators/Field';
import { ObjectID } from 'bson';
import { ObjectIdField } from '../decorators/ObjectIdField';

export class User {
  @ObjectIdField()
  id: ObjectID;
  @Field()
  name: string;
  @Field()
  age: number;
}