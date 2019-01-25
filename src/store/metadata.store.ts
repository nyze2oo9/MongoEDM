import { FieldMetaData } from '../classes/field-metadata.class';
import { NestedMetaData } from '../classes/nested-metadata.class';
import { RelationMetaData } from '../classes/relation-metadata.class';
import { EntityMetaData } from '../classes/entity-metadata.class';
import { ChildEntityMetaData } from '../classes/child-entitiy-metadata.class';
import { IndexMetaData } from '../classes/index-metadata.class';

export class MetaDataStore {
  static entities: EntityMetaData[] = [];
  static childEntities: ChildEntityMetaData[] = [];

  static fields: FieldMetaData[] = [];
  static nested: NestedMetaData[] = [];
  static relations: RelationMetaData[] = [];

  static indexes: IndexMetaData[] = [];
 }