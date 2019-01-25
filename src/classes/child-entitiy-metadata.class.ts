import { EntityFunction } from '../types/entity-function.type';

export class ChildEntityMetaData {
  parentDocumentFunction?: EntityFunction | EntityFunction[];
  entity: new () => any;
}