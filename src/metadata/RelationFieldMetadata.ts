import { INestedFieldMetaDataArgs } from '../metadata-args/INestedFieldMetaDataArgs';
import { EntityMetadata } from './EntityMetadata';
import { FieldMetadata } from './FieldMetadata';
import { NestedFieldMetadata } from './NestedFieldMetadata';
import { IRelationFieldMetaDataArgs } from '../metadata-args/IRelationFieldMetaDataArgs';

export class RelationFieldMetadata {
  /**
   * Entity metadata of the entity where this relation is placed.
   *
   * For example for @ManyToMany(type => Category) in Post, entityMetadata will be metadata of Post entity.
   */
  entityMetadata: EntityMetadata;

  /**
   * Entity metadata of the entity that is targeted by this relation.
   *
   * For example for @ManyToMany(type => Category) in Post, inverseEntityMetadata will be metadata of Category entity.
   */
  inverseEntityMetadata: EntityMetadata;

  /**
   * Nested field metadata where this relation is.
   * If this relation is not in a nested field then this property value is undefined.
   */
  nestedFieldMetadata?: NestedFieldMetadata;

  /**
   * Target entity to which this relation is applied.
   * Target IS NOT equal to entityMetadata.target, because relation
   *
   * For example for @ManyToMany(type => Category) in Post, target will be Post.
   * If @ManyToMany(type => Category) is in Counters which is embedded into Post, target will be Counters.
   * If @ManyToMany(type => Category) is in abstract class BaseUser which Post extends, target will be BaseUser.
   * Target can be string if its defined in entity schema instead of class.
   */
  target: Function | string;

  /**
   * Defines the key for the database
   */
  databaseKey: string;

  /**
   * Target's property name to which relation decorator is applied.
   */
  entityKey: string;

  /**
   * Indicates if this relation is eagerly loaded.
   */
  isEager: boolean = false;

  /**
   * If set to true then related objects will be also persisted on save/remove call
   */
  isCascade: boolean = false;

  /**
   * Defines the type for the nested property as a function
   */
  type: Function;

  /**
   * Indicates if this embedded is in array mode.
   */
  isArray: boolean;

  constructor(options: { entityMetadata: EntityMetadata, nestedFieldMetadata?: NestedFieldMetadata, args: IRelationFieldMetaDataArgs }) {
    const {entityMetadata, nestedFieldMetadata, args} = options;
    this.entityMetadata = entityMetadata;
    this.nestedFieldMetadata = nestedFieldMetadata!;
    this.target = args.target;
    this.entityKey = args.propertyKey;
    this.databaseKey = args.fieldName ? args.fieldName : args.propertyKey;
    this.isCascade = args.options.cascade === true;
    this.isEager = args.options.eager === true;
    this.type = args.typeFunction();
    this.isArray = args.isArray;
  }

  /**
   * Creates a new embedded object.
   */
  create(): any {
    return new (this.type as any)();
  }
}
