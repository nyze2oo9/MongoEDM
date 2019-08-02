import { ObjectID } from 'bson';
import { Entity, Field } from '../../../../../../src';
import { ObjectIdField } from '../../../../../../src/decorators/ObjectIdField';

@Entity()
export class Item {
  @ObjectIdField()
  id: ObjectID;
  @Field()
  name: string;
  @Field()
  price: number;
}
