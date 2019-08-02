import { ObjectIdField } from '../../../../../../../src/decorators/ObjectIdField';
import { ObjectId } from 'bson';
import { Entity, Field } from '../../../../../../../src';
import { RelationField } from '../../../../../../../src/decorators/RelationField';
import { Artist } from './Artist';

@Entity()
export class Movie {
  @ObjectIdField()
  id: ObjectId;

  @RelationField(type => Artist, {
    cascade: true
  })
  artist: Artist;

  @Field()
  name: string;
}
