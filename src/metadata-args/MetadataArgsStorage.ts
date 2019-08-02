import { ChildEntityMetaData } from '../classes/child-entitiy-metadata.class';
import { IndexMetaData } from '../classes/index-metadata.class';
import { ICollectionMetaDataArgs } from './ICollectionMetaDataArgs';
import { IFieldMetaDataArgs } from './IFieldMetaDataArgs';
import { IObjectIdFieldMetaDataArgs } from './IObjectIdFieldMetaDataArgs';
import { INestedFieldMetaDataArgs } from './INestedFieldMetaDataArgs';
import { IRelationFieldMetaDataArgs } from './IRelationFieldMetaDataArgs';

export class MetadataArgsStorage {
  readonly collections: ICollectionMetaDataArgs[] = [];
  readonly childEntities: ChildEntityMetaData[] = [];

  readonly fields: IFieldMetaDataArgs[] = [];
  readonly objectIdFields: IObjectIdFieldMetaDataArgs[] = [];
  readonly nestedFields: INestedFieldMetaDataArgs[] = [];
  readonly relationFields: IRelationFieldMetaDataArgs[] = [];

  readonly indexes: IndexMetaData[] = [];

  readonly toEntityTransformFunctions = [];

  findObjectIdField(target: Function | string): IObjectIdFieldMetaDataArgs;
  findObjectIdField(target: (Function | string)[]): IObjectIdFieldMetaDataArgs;
  findObjectIdField(target: (Function | string) | (Function | string)[]): IObjectIdFieldMetaDataArgs {
    return this.objectIdFields.find(objectIdFieldArgs => {
      if (target instanceof Array) return target.includes(objectIdFieldArgs.target);
      return target === objectIdFieldArgs.target;
    });
  }

  filterCollections(targets: Function[]): ICollectionMetaDataArgs[] {
    return this.collections.filter(collection => {
      return targets.some(targetEntry => collection.entities.includes(targetEntry));
    });
  }

  filterFields(target: Function | string): IFieldMetaDataArgs[];
  filterFields(target: (Function | string)[]): IFieldMetaDataArgs[];
  filterFields(target: (Function | string) | (Function | string)[]): IFieldMetaDataArgs[] {
    return this.fields.filter(field => {
      if (target instanceof Array) return target.includes(field.target);
      return target === field.target;
    });
  }

  filterNestedFields(target: Function | string): INestedFieldMetaDataArgs[];
  filterNestedFields(target: (Function | string)[]): INestedFieldMetaDataArgs[];
  filterNestedFields(target: (Function | string) | (Function | string)[]): INestedFieldMetaDataArgs[] {
    return this.nestedFields.filter(nestedField => {
      if (target instanceof Array) return target.includes(nestedField.target);
      return target === nestedField.target;
    });
  }

  filterRelationFields(target: Function | string): IRelationFieldMetaDataArgs[];
  filterRelationFields(target: (Function | string)[]): IRelationFieldMetaDataArgs[];
  filterRelationFields(target: (Function | string) | (Function | string)[]): IRelationFieldMetaDataArgs[] {
    return this.relationFields.filter(relationField => {
      if (target instanceof Array) return target.includes(relationField.target);
      return target === relationField.target;
    });
  }
}
