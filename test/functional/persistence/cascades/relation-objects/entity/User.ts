import { Entity } from '../../../../../../src/decorators/Entity';
import { ObjectIdField } from '../../../../../../src/decorators/ObjectIdField';
import { ObjectId } from 'bson';
import { Profile } from './Profile';
import { RelationField } from '../../../../../../src/decorators/RelationField';
import { Field } from '../../../../../../src';

@Entity()
export class User {
  @ObjectIdField()
  id: ObjectId;

  @RelationField(type => Profile, {
    cascade: true
  })
  profile: Profile;

  @Field()
  password: string;
}
