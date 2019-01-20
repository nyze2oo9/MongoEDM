import { MetaDataStore } from '../store/metadata.store';
import { isString, isEmpty } from 'lodash';
import { EntityMetaData } from '../classes/entity-metadata.class';

export function Entity(collectionName?: string) {
  return function (object: any) {
    collectionName = isString(collectionName) && !isEmpty(collectionName) ? collectionName : object.name.toLowerCase() as string;

    const filteredCollection = MetaDataStore.entities.filter(entity => entity.collectionName === collectionName);
    if (filteredCollection.length > 0) {
      throw new Error(`CollectionName ${collectionName} already used by another collection.`);
    }

    const entityMetaData = new EntityMetaData();
    entityMetaData.entity = object;
    entityMetaData.collectionName = collectionName;

    MetaDataStore.entities.push(entityMetaData);
  };
}