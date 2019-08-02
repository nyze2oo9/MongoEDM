import { Entity } from '../decorators/Entity';

@Entity()
export class Address {
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
  country: string;
}
