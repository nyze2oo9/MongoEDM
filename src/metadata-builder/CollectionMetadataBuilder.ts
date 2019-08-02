import { MetadataArgsStorage } from '../metadata-args/MetadataArgsStorage';
import { CollectionMetadata } from '../metadata/CollectionMetadata';
import { EntityMetadata } from '../metadata/EntityMetadata';
import { FieldMetadata } from '../metadata/FieldMetadata';
import { MetadataUtils } from './MetadataUtils';
import { ObjectIdFieldMetadata } from '../metadata/ObjectIdFieldMetadata';
import { NestedFieldMetadata } from '../metadata/NestedFieldMetadata';
import { INestedFieldMetaDataArgs } from '../metadata-args/INestedFieldMetaDataArgs';
import { IFieldMetaDataArgs } from '../metadata-args/IFieldMetaDataArgs';
import { RelationFieldMetadata } from '../metadata/RelationFieldMetadata';
import { IRelationFieldMetaDataArgs } from '../metadata-args/IRelationFieldMetaDataArgs';

export class CollectionMetadataBuilder {
  /**
   * Holds all entity metadata instances for easier filtering
   */
  private entityMetadatas: EntityMetadata[] = [];

  constructor(private metadataArgsStorage: MetadataArgsStorage) {}
  /**
   * Builds all collection metadatas for the given entity classes.
   */
  build(entityClasses?: Function[]): CollectionMetadata[] {
    const allCollectionMetadataArgs = entityClasses
      ? this.metadataArgsStorage.filterCollections(entityClasses)
      : this.metadataArgsStorage.collections;

    const collectionMetadatas = allCollectionMetadataArgs.map(collectionArgs => new CollectionMetadata(collectionArgs));

    // Create EntityMetadata instances
    collectionMetadatas.forEach(
      collectionMetadata => (collectionMetadata.entityMetadatas = collectionMetadata.targets.map(target => this.computeEntityMetadata(collectionMetadata, target)))
    );

    // Compute Properties of EntityMetadata instances
    collectionMetadatas.forEach(collectionMetadata =>
      collectionMetadata.entityMetadatas.forEach(entityMetadata => this.computeEntityMetadataProperties(entityMetadata))
    );
    return collectionMetadatas;
  }

  private computeEntityMetadata(collectionMetadata: CollectionMetadata, target: Function) {
    const inheritanceTree: any[] = MetadataUtils.getInheritanceTree(target);

    const entityMetadata = new EntityMetadata(collectionMetadata, target, inheritanceTree);
    this.entityMetadatas.push(entityMetadata);
    return entityMetadata;
  }

  private computeEntityMetadataProperties(entityMetadata: EntityMetadata) {
    entityMetadata.objectIdField = new ObjectIdFieldMetadata(this.metadataArgsStorage.findObjectIdField(entityMetadata.inheritanceTree));

    entityMetadata.fields = this.createFields(this.metadataArgsStorage.filterFields(entityMetadata.inheritanceTree));

    entityMetadata.nestedFields = this.createEmbeddedsRecursively(
      entityMetadata,
      this.metadataArgsStorage.filterNestedFields(entityMetadata.inheritanceTree)
    );

    entityMetadata.relationFields = this.metadataArgsStorage
      .filterRelationFields(entityMetadata.inheritanceTree)
      .map(args => new RelationFieldMetadata({ entityMetadata, args }));

    entityMetadata.relationFields.forEach(relationField => {
      const inverseEntityMetadata = this.entityMetadatas.find(
        m => m.target === relationField.type || (typeof relationField.type === 'string' && m.targetName === relationField.type)
      );
      if (!inverseEntityMetadata) {
        throw new Error(
          `Entity metadata for ${entityMetadata.targetName} # ${
            relationField.entityKey
          } was not found. Check if you specified a correct entity object and if it's connected in the connection options.`
        );
      }
      inverseEntityMetadata.reverseRelations.push(relationField);
      relationField.inverseEntityMetadata = inverseEntityMetadata;
    });
  }

  private createEmbeddedsRecursively(entityMetadata: EntityMetadata, nestedFieldMetaDataArgs: INestedFieldMetaDataArgs[]) {
    return nestedFieldMetaDataArgs.map(nestedFieldMetaDataArgs => {
      const nestedFieldMetadata = new NestedFieldMetadata({
        entityMetadata: entityMetadata,
        args: nestedFieldMetaDataArgs
      });
      const targets = MetadataUtils.getInheritanceTree(nestedFieldMetadata.type);

      nestedFieldMetadata.fields = this.metadataArgsStorage.filterFields(targets).map(args => {
        return new FieldMetadata(args);
      });

      nestedFieldMetadata.relations = this.metadataArgsStorage.filterRelationFields(targets).map(args => {
        return new RelationFieldMetadata({ entityMetadata, nestedFieldMetadata, args });
      });

      nestedFieldMetadata.nestedFields = this.createEmbeddedsRecursively(entityMetadata, this.metadataArgsStorage.filterNestedFields(targets));
      return nestedFieldMetadata;
    });
  }

  private createFields(fieldMetaDataArgs: IFieldMetaDataArgs[]) {
    return fieldMetaDataArgs.map(fieldArgs => new FieldMetadata(fieldArgs));
  }
}
