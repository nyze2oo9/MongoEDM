import { Entity, Field } from '../../../../../../src';
import { ObjectID } from 'bson';
import { ObjectIdField } from '../../../../../../src/decorators/ObjectIdField';
import { Answer } from './Answer';
import { NestedField } from '../../../../../../src/decorators/NestedField';
import { User } from './User';

@Entity()
export class Question {
  @ObjectIdField()
  id: ObjectID;

  @Field()
  text: string;

  @NestedField(type => Answer)
  answers: Answer[];

  @NestedField(type => User)
  user: User;
}