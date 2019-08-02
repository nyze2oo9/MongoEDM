import { getMetadataArgsStorage } from '..';
import { IRelationFieldOptions } from './options/IRelationFieldOptions';

export function RelationField(typeFunction: (type: any) => Function, options?: IRelationFieldOptions);

export function RelationField(fieldName: string, typeFunction: (type: any) => Function, options?: IRelationFieldOptions);

export function RelationField(fieldNameOrTypeFunction: string | ((type: any) => Function), optionsOrTypeFunction?: IRelationFieldOptions | ((type: any) => Function), options?: IRelationFieldOptions) {
  return function(object: Object, propertyKey: string) {
    const fieldName = typeof fieldNameOrTypeFunction === 'string' ? fieldNameOrTypeFunction : undefined;
    const typeFunction = (fieldNameOrTypeFunction instanceof Function ? fieldNameOrTypeFunction : optionsOrTypeFunction) as (type: any) => Function;
    options = optionsOrTypeFunction instanceof Function ? options : optionsOrTypeFunction;

    const reflectMetadataType =
      Reflect && (Reflect as any).getMetadata ? (Reflect as any).getMetadata('design:type', object, propertyKey) : undefined;

    getMetadataArgsStorage().relationFields.push({
      fieldName,
      propertyKey,
      target: object.constructor,
      isArray: reflectMetadataType === Array,
      typeFunction,
      options: options !== undefined ? options : {} as IRelationFieldOptions
    });
  };
}
