import { FieldMetaData } from '../classes/field-metadata.class';
import { NestedMetaData } from '../classes/nested-metadata.class';
import { RelationMetaData } from '../classes/relation-metadata.class';
import { EntityMetaData } from '../classes/entity-metadata.class';
import { ChildEntityMetaData } from '../classes/child-entitiy-metadata.class';

export class MetaDataStore {
  static readonly entities: EntityMetaData[] = [];
  static readonly childEntities: ChildEntityMetaData[] = [];

  static readonly fields: FieldMetaData[] = [];
  static readonly nested: NestedMetaData[] = [];
  static readonly relations: RelationMetaData[] = [];
 }