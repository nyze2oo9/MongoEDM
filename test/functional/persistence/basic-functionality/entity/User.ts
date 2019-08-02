import { ObjectID } from 'bson';
import { ObjectIdField } from '../../../../../src/decorators/ObjectIdField';
import { Entity } from '../../../../../src/decorators/Entity';
import { Field } from '../../../../../src/decorators/Field';

@Entity()
export class User {
  @ObjectIdField()
  id: ObjectID;
  @Field()
  name: string;
  @Field()
  age: number;
}