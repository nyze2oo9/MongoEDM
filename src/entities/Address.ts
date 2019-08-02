import { Entity } from '../decorators/Entity';
import { Field } from '../decorators/Field';

@Entity()
export class Address {
  @Field()
  street: string;
  @Field('house_number')
  houseNumber: string;
  @Field()
  zip: string;
  @Field()
  city: string;
  @Field()
  country: string;
}