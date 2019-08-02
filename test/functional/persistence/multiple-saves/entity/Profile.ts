import { ObjectIdField } from '../../../../../src/decorators/ObjectIdField';
import { ObjectId } from 'bson';
import { Photo } from './Photo';
import { Entity, Field } from '../../../../../src';
import { RelationField } from '../../../../../src/decorators/RelationField';

@Entity()
export class Profile {
  @ObjectIdField()
  id: ObjectId;

  @RelationField(type => Photo)
  photo: Photo;

  @Field()
  username: string;
}
