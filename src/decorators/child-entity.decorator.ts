import { ChildEntityMetaData } from '../classes/child-entitiy-metadata.class';
import { EntityFunction } from '../types/entity-function.type';

export function ChildEntity(parentDocumentFunction?: EntityFunction | EntityFunction[]) {
  return function(object: any) {
    const childEntityMetaData = new ChildEntityMetaData();
    childEntityMetaData.entity = object;
    childEntityMetaData.parentDocumentFunction = parentDocumentFunction;

    //MetaDataStore.childEntities.push(childEntityMetaData);
  };
}
