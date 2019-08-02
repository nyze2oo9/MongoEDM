import { IRelationFieldOptions } from '../decorators/options/IRelationFieldOptions';

export interface IRelationFieldMetaDataArgs {
  fieldName?: string;
  propertyKey: string;
  target: Function;
  typeFunction: (type?: any) => Function;
  isArray: boolean;
  options: IRelationFieldOptions;
}
