import { Field } from '../../../../../../src';
import { RelationField } from '../../../../../../src/decorators/RelationField';
import { Item } from './Item';

export class Order {
  @Field()
  date: number;
  @RelationField(type => Item, { cascade: true })
  items: Item[];
}
