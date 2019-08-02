import { getMetadataArgsStorage } from '..';

export function Field(fieldName?: string) {
  return function (target: Object, propertyKey: string) {
    getMetadataArgsStorage().fields.push({
      fieldName,
      propertyKey,
      target: target.constructor
    });
  };
}