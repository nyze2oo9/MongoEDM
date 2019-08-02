import { EntityMetadata } from './EntityMetadata';
import { ICollectionMetaDataArgs } from '../metadata-args/ICollectionMetaDataArgs';

export class CollectionMetadata {
  /**
   * All entities with all the associated metadata belonging to this collection
   */
  entityMetadatas: EntityMetadata[];

  /**
   * All entities belonging to this collection
   */
  targets: Function[];

  /**
   * Name of the collection
   */
  name: string;

  constructor(args: ICollectionMetaDataArgs) {
    this.name = args.name;
    this.targets = args.entities;
  }

  /**
   * Creates a new entity.
   */
  create(type?: string | undefined): any {
    // if this collection has just one entity
    if (this.targets.length === 1) return new (<any>this.targets[0])();
    else {
      const entity = this.targets.find(entity => entity.name === type);
      return new (<any>entity)();
    }
  }

  /**
   * Returns the matchin entityMetadata instance
   */
  getEntityMetadata(targetOrTargetName?: Function | string): EntityMetadata {
    if (!targetOrTargetName || this.entityMetadatas.length === 1) return this.entityMetadatas[0];
    else {
      return this.entityMetadatas.find(
        entityMetadata =>
          entityMetadata.targetName === targetOrTargetName || entityMetadata.target === targetOrTargetName
      );
    }
  }
}
