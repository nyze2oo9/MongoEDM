import { IType } from "../interfaces/type.interface";

export class RelationMetaData {
  target: any;
  propertyKey: string;
  updateable: boolean;
  typeFunction: () => any;
  types: IType[];
  inverseRelation?: string;
}