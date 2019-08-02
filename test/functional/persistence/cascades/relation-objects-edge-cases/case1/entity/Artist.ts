import { ObjectIdField } from '../../../../../../../src/decorators/ObjectIdField';
import { Field, Entity } from '../../../../../../../src';
import { ObjectId } from 'bson';

@Entity()
export class Artist {
  @ObjectIdField()
  id: ObjectId;

  @Field()
  name: string;
}
