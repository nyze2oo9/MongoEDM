import { IType } from '../interfaces/type.interface';
import { EntityFunction } from '../types/entity-function.type';

export class NestedMetaData {
  target: any;
  propertyKey: string;
  typeFunction: EntityFunction;
  types: IType[];
  // inverseRelation?: string;
}