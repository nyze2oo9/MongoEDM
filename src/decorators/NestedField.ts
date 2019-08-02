import { getMetadataArgsStorage } from '..';

export function NestedField(typeFunction: (type: any) => Function);

export function NestedField(fieldName: string, typeFunction: (type: any) => Function);

export function NestedField(
  fieldNameOrTypeFunction: string | ((type: any) => Function),
  typeFunction?: (type: any) => Function
) {
  return function(object: Object, propertyKey: string) {
    let fieldName;
    if (typeof fieldNameOrTypeFunction === 'string') fieldName = fieldNameOrTypeFunction;
    else typeFunction = fieldNameOrTypeFunction;

    const reflectMetadataType =
      Reflect && (Reflect as any).getMetadata
        ? (Reflect as any).getMetadata('design:type', object, propertyKey)
        : undefined;

    getMetadataArgsStorage().nestedFields.push({
      fieldName,
      propertyKey,
      target: object.constructor,
      isArray: reflectMetadataType === Array,
      typeFunction
    });
  };
}
