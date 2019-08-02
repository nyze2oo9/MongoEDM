import { Entity } from '../decorators/Entity';
import { User } from './User';
import { Field } from '../decorators/Field';

@Entity('users')
export class Author extends User {
  @Field()
  role = 'author';
}
