import { ObjectID } from 'bson';
import { ObjectIdField } from '../../../../../src/decorators/ObjectIdField';
import { Field } from '../../../../../src/decorators/Field';
import { Entity } from '../../../../../src/decorators/Entity';

@Entity()
export class Post {
  @ObjectIdField()
  id: ObjectID;
  @Field()
  name: string;
  @Field()
  text: string;
}