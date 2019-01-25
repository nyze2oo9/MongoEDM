import { IType } from '../interfaces/type.interface';

export class RelationMetaData {
  target: any;
  propertyKey: string;
  typeFunction: () => any;
  types: IType[];
  // inverseRelation?: string;
}