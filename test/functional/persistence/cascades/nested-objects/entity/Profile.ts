import { ObjectIdField } from '../../../../../../src/decorators/ObjectIdField';
import { ObjectId } from 'bson';
import { Photo } from './Photo';
import { NestedField } from '../../../../../../src/decorators/NestedField';

export class Profile {

    @ObjectIdField()
    id: ObjectId;

    @NestedField(type => Photo)
    photo: Photo;

}