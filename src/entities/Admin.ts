import { Entity } from '../decorators/Entity';
import { User } from './User';
import { Field } from '../decorators/Field';

@Entity('users')
export class Admin extends User {
  @Field()
  role = 'admin';
}
