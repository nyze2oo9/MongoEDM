import { Entity } from '../../../../../../src/decorators/Entity';
import { ObjectIdField } from '../../../../../../src/decorators/ObjectIdField';
import { ObjectId } from 'bson';
import { NestedField } from '../../../../../../src/decorators/NestedField';
import { Profile } from './Profile';


@Entity()
export class User {

    @ObjectIdField()
    id: ObjectId;

    @NestedField(type => Profile)
    profile: Profile;

}