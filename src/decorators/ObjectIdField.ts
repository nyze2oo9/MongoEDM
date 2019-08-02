import { getMetadataArgsStorage } from '..';

export function ObjectIdField() {
  return function (target: Object, propertyKey: string) {
    getMetadataArgsStorage().objectIdFields.push({
      propertyKey,
      target: target.constructor
    });
  };
}