import { ObjectIdField } from '../../../../../../src/decorators/ObjectIdField';
import { Field, Entity } from '../../../../../../src';
import { ObjectId } from 'bson';

@Entity()
export class Photo {
  @ObjectIdField()
  id: ObjectId;

  @Field()
  path: string;
}
