import { Address } from './Address';
import { Entity } from '../decorators/Entity';

@Entity()
export class Admin {
  name: string;
  address: Address;
  age: number;
}