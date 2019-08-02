import { EntityMetadata } from '../../metadata/EntityMetadata';
import { ObjectLiteral } from '../../common/ObjectLiteral';
import { CollectionMetadata } from '../../metadata/CollectionMetadata';
import { NestedFieldMetadata } from '../../metadata/NestedFieldMetadata';

/**
 * Transforms entity into raw document.
 */
export class EntityToDocumentTransformer {
  transformAll(entities: ObjectLiteral[], entityMetadata: EntityMetadata) {
    return entities.map(document => this.transform(document, entityMetadata));
  }

  transform(entity: ObjectLiteral, entityMetadata: EntityMetadata) {
    const document: any = {};

    if (entityMetadata.objectIdField && entity[entityMetadata.objectIdField.entityKey]) {
      document['_id'] = entity[entityMetadata.objectIdField.entityKey];
    }

    entityMetadata.relationFields.forEach(field => {
      const relationEntityOrEntities = entity[field.entityKey];
      if (field.isArray) {
        const relationEntities: any[] = relationEntityOrEntities;
        document[field.databaseKey] = relationEntities.map(entity => entity[field.inverseEntityMetadata.objectIdField.entityKey]);
      } else {
        const relationEntity = relationEntityOrEntities;
        const objectId = relationEntity[field.inverseEntityMetadata.objectIdField.entityKey];
        document[field.databaseKey] = objectId;
      }
    });

    entityMetadata.fields.forEach(field => {
      const valueInObject = entity[field.entityKey];
      if (valueInObject !== undefined && valueInObject !== null) {
        document[field.databaseKey] = valueInObject;
      }
    });

    const addEmbeddedValuesRecursively = (entity: any, document: any, nestedFields: NestedFieldMetadata[]) => {
      nestedFields.forEach(nestedField => {
        if (!entity[nestedField.entityKey]) return;

        document[nestedField.databaseKey] = {};

        if (nestedField.isArray) {
          document[nestedField.databaseKey] = (entity[nestedField.entityKey] as any[]).map((subValue: any, index: number) => {
            const newItem = {};
            nestedField.fields.forEach(field => {
              newItem[field.databaseKey] = subValue[field.entityKey];
            });
            addEmbeddedValuesRecursively(entity[nestedField.entityKey][index], newItem, nestedField.nestedFields);
            return newItem;
          });
        } else {
          nestedField.fields.forEach(field => {
            const value = entity[nestedField.entityKey][field.entityKey];
            if (!value) return;

            if (!document[nestedField.databaseKey]) document[nestedField.databaseKey] = {};

            document[nestedField.databaseKey][field.databaseKey] = value;
          });
        }
        addEmbeddedValuesRecursively(entity[nestedField.entityKey], document[nestedField.databaseKey], nestedField.nestedFields);
      });
    };

    addEmbeddedValuesRecursively(entity, document, entityMetadata.nestedFields);

    // if document is an empty object (e.g. {}) then we return null
    return Object.entries(document).length === 0 && document.constructor === Object ? null : document;
  }
}
