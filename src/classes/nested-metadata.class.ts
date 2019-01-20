import { IType } from "../interfaces/type.interface";

export class NestedMetaData {
  target: any;
  propertyKey: string;
  typeFunction: () => any;
  types: IType[];
  inverseRelation?: string;
}