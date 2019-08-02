import { IObjectIdFieldMetaDataArgs } from '../metadata-args/IObjectIdFieldMetaDataArgs';

/**
 * This metadata contains all information about entity's object id field.
 */
export class ObjectIdFieldMetadata {
  /**
   * Defines the key for the entity.
   */
  entityKey: string;

  constructor(args: IObjectIdFieldMetaDataArgs) {
    this.entityKey = args.propertyKey;
  }
}
