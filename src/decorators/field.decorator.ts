import { MetaDataStore } from '../store/metadata.store';
import { FieldMetaData } from '../classes/field-metadata.class';

export function Field(): void;
export function Field(fieldName?: string) {
  return function (object: Object, propertyKey: string) {
    const fieldMetadata = new FieldMetaData();

    fieldMetadata.fieldName = fieldName;
    fieldMetadata.propertyKey = propertyKey;
    fieldMetadata.target = object.constructor;

    MetaDataStore.fields.push(fieldMetadata);
  };
}