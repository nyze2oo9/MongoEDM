import { Connection } from './Connection';
import { OdmUtils } from '../util/OdmUtils';
import { importClassesFromDirectories } from '../util/DirectoryExportedClassesLoader';
import { getMetadataArgsStorage } from '..';
import { CollectionMetadataBuilder } from '../metadata-builder/CollectionMetadataBuilder';
import { CollectionMetadata } from '../metadata/CollectionMetadata';

export class ConnectionMetadataBuilder {
  constructor(protected connection: Connection) {}

  /**
   * Builds collection metadatas for the given classes or directories.
   */
  buildCollectionMetadatas(entities: (Function | string)[]): CollectionMetadata[] {
    const [entityClasses, entityDirectories] = OdmUtils.splitClassesAndStrings(entities || []);

    const allEntityClasses = [...entityClasses, ...importClassesFromDirectories(entityDirectories)];

    const collectionMetadatas = new CollectionMetadataBuilder(getMetadataArgsStorage()).build(allEntityClasses);

    return collectionMetadatas;
  }
}
