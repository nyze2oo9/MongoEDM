import { INestedFieldMetaDataArgs } from '../metadata-args/INestedFieldMetaDataArgs';
import { EntityMetadata } from './EntityMetadata';
import { FieldMetadata } from './FieldMetadata';
import { RelationFieldMetadata } from './RelationFieldMetadata';

export class NestedFieldMetadata {
  /**
   * Entity metadata where this nested property is in.
   */
  entityMetadata: EntityMetadata;

  /**
   * Defines the key for the database
   */
  databaseKey: string;

  /**
   * Defines the key for the entity.
   */
  entityKey: string;

  /**
   * Defines the type for the nested property as a function
   */
  type: Function;

  /**
   * Indicates if this embedded is in array mode.
   */
  isArray: boolean;

  /**
   * Holds the metdata for all the fields of the nested field.
   */
  fields: FieldMetadata[];

  /**
   * Holds the metdata for all the relations of the nested field.
   */
  relations: RelationFieldMetadata[];

  /**
   * Holds the metdata for all the nested fields of the nested field.
   */
  nestedFields: NestedFieldMetadata[];

  constructor(options: { entityMetadata: EntityMetadata; args: INestedFieldMetaDataArgs }) {
    this.entityMetadata = options.entityMetadata;
    this.type = options.args.typeFunction();
    this.databaseKey = options.args.fieldName ? options.args.fieldName : options.args.propertyKey;
    this.entityKey = options.args.propertyKey;
    this.isArray = options.args.isArray;
  }

  /**
   * Creates a new embedded object.
   */
  create(): any {
    return new (this.type as any)();
  }
}
