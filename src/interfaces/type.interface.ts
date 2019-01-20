export interface IType {
  typeFunction: () => any;
  conditionFunction: (entityInstance: any) => boolean;
}