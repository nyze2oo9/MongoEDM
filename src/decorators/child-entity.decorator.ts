import { MetaDataStore } from '../store/metadata.store';
import { ChildEntityMetaData } from '../classes/child-entitiy-metadata.class';

export function ChildEntity(rootDocumentFunction?: () => any) {
  return function (object: any) {
    const childEntityMetaData = new ChildEntityMetaData();
    childEntityMetaData.entity = object;
    childEntityMetaData.rootDocumentFunction = rootDocumentFunction;

    MetaDataStore.childEntities.push(childEntityMetaData);
  };
}