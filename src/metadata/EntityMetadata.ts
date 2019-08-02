import { ObjectIdFieldMetadata } from './ObjectIdFieldMetadata';
import { FieldMetadata } from './FieldMetadata';
import { NestedFieldMetadata } from './NestedFieldMetadata';
import { RelationFieldMetadata } from './RelationFieldMetadata';
import { CollectionMetadata } from './CollectionMetadata';

export class EntityMetadata {
  /**
   * Target class to which this entity metadata is bind.
   */
  target: Function;

  /**
   * Gets the name of the target.
   */
  targetName: string;

  /**
   * Holds the metadata for the object id field.
   */
  objectIdField?: ObjectIdFieldMetadata;

  /**
   * Holds the metadata for all the fields of the entity.
   */
  fields: FieldMetadata[];

  /**
   * Holds the metadata for all the nested fields of the entity.
   */
  nestedFields: NestedFieldMetadata[];

  /**
   * Holds the metadata for all the relation fields of the entity.
   */
  relationFields: RelationFieldMetadata[];

  /**
   * All "inheritance tree" from a target entity.
   * For example for target Post < ContentModel < Unit it will be an array of [Post, ContentModel, Unit].
   */
  inheritanceTree: Function[] = [];

  /**
   * Holds the collection Metadata reference.
   */
  collectionMetadata: CollectionMetadata;

  /**
   * All entities stored in this array have a relation to the current entity
   */
  reverseRelations: RelationFieldMetadata[] = [];

  constructor(collectionMetadata: CollectionMetadata, target: Function, inheritanceTree: Function[]) {
    this.collectionMetadata = collectionMetadata;
    this.target = target;
    this.targetName = target.name;
    this.inheritanceTree = inheritanceTree;
  }
}
