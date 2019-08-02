import { NestedField } from '../../../../../../src/decorators/NestedField';
import { Field } from '../../../../../../src';
import { User } from './User';

export class Answer {
  @Field()
  text: string;

  @NestedField(type => User)
  user: User;
}