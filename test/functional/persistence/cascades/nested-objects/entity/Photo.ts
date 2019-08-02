import { ObjectIdField } from '../../../../../../src/decorators/ObjectIdField';
import { Field } from '../../../../../../src';
import { ObjectId } from 'bson';

export class Photo {

    @ObjectIdField()
    id: ObjectId;

    @Field()
    path: string;
}