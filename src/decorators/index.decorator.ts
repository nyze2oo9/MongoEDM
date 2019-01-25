import { MetaDataStore } from '../store/metadata.store';
import { IndexMetaData } from '../classes/index-metadata.class';

export function Index() {
  return function (object: Object, propertyKey: string) {
    const indexMetaData = new IndexMetaData();

    indexMetaData.propertyKey = propertyKey;
    indexMetaData.target = object;

    MetaDataStore.indexes.push(indexMetaData);
  };
}