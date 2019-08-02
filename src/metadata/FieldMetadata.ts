import { IFieldMetaDataArgs } from '../metadata-args/IFieldMetaDataArgs';

export class FieldMetadata {
  /**
   * Defines the key for the database
   */
  databaseKey: string;

  /**
   * Defines the key for the entity.
   */
  entityKey: string;

  constructor(args: IFieldMetaDataArgs) {
    this.databaseKey = args.fieldName ? args.fieldName : args.propertyKey;
    this.entityKey = args.propertyKey;
  }
}
