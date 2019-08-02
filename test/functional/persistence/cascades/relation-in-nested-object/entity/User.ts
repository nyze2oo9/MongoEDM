import { Entity } from '../../../../../../src/decorators/Entity';
import { ObjectIdField } from '../../../../../../src/decorators/ObjectIdField';
import { ObjectId } from 'bson';
import { NestedField } from '../../../../../../src/decorators/NestedField';
import { Order } from './Order';


@Entity()
export class User {

    @ObjectIdField()
    id: ObjectId;

    @NestedField(type => Order)
    orders: Order[];

}