export class FieldMetaData {
  target: any;
  propertyKey: string;
  fieldName?: string;

  getFieldName() {
    return this.fieldName ? this.fieldName : this.propertyKey;
  }
}