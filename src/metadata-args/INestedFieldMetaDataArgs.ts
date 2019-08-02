export interface INestedFieldMetaDataArgs {
  fieldName?: string;
  propertyKey: string;
  target: Function;
  typeFunction: (type?: any) => Function;
  isArray: boolean;
}
