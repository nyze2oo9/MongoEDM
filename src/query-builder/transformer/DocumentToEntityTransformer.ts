import { EntityMetadata } from '../../metadata/EntityMetadata';
import { ObjectLiteral } from '../../common/ObjectLiteral';
import { CollectionMetadata } from '../../metadata/CollectionMetadata';

/**
 * Transforms raw document into entity object.
 * Entity is constructed based on its entity metadata.
 */
export class DocumentToEntityTransformer {
  transformAll(documents: ObjectLiteral[], metadata: CollectionMetadata) {
    return documents.map(document => this.transform(document, metadata));
  }

  transform(document: any, collectionMetadata: CollectionMetadata) {
    const { type } = document;
    const entity: any = collectionMetadata.create(type);
    const entityMetadata = collectionMetadata.getEntityMetadata(type);
    let hasData = false;

    if (entityMetadata.objectIdField && document['_id']) {
      entity[entityMetadata.objectIdField.entityKey] = document['_id'];
      hasData = true;
    }

    // document should contain everything (so also resolved relations)
    // iterate over relations and if document contains resolved relation then add it to entity otherwise skip it

    entityMetadata.fields.forEach(field => {
      const valueInObject = document[field.databaseKey];
      if (valueInObject !== undefined && valueInObject !== null) {
        entity[field.entityKey] = valueInObject;
        hasData = true;
      }
    });

    // const addEmbeddedValuesRecursively = (entity: any, document: any, embeddeds: EmbeddedMetadata[]) => {
    //   embeddeds.forEach(embedded => {
    //     if (!document[embedded.prefix]) return;

    //     if (embedded.isArray) {
    //       entity[embedded.propertyName] = (document[embedded.prefix] as any[]).map((subValue: any, index: number) => {
    //         const newItem = embedded.create();
    //         embedded.columns.forEach(column => {
    //           newItem[column.propertyName] = subValue[column.databaseNameWithoutPrefixes];
    //         });
    //         addEmbeddedValuesRecursively(newItem, document[embedded.prefix][index], embedded.embeddeds);
    //         return newItem;
    //       });
    //     } else {
    //       embedded.columns.forEach(column => {
    //         const value = document[embedded.prefix][column.databaseNameWithoutPrefixes];
    //         if (value === undefined) return;

    //         if (!entity[embedded.propertyName]) entity[embedded.propertyName] = embedded.create();

    //         entity[embedded.propertyName][column.propertyName] = value;
    //       });
    //     }
    //     addEmbeddedValuesRecursively(entity[embedded.propertyName], document[embedded.prefix], embedded.embeddeds);
    //   });
    // };

    // addEmbeddedValuesRecursively(entity, document, metadata.embeddeds);

    return hasData ? entity : null;
  }
}
