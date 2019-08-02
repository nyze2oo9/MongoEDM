import { ObjectLiteral } from '../common/ObjectLiteral';
import { CannotDetermineEntityError } from '../error/CannotDetermineEntityError';
import { QueryRunner } from '../query-runner/QueryRunner';
import { Connection } from '../connection/Connection';
import { CollectionMetadata } from '../metadata/CollectionMetadata';
import { NoInsertedIdReturnedError } from '../error/NoInsertedIdReturnedError';
import { EntityToDocumentTransformer } from '../query-builder/transformer/EntityToDocumentTransformer';
import { ObjectID } from 'bson';
import { MustBeEntityError } from '../error/MustBeEntityError';
import { Index } from '../decorators/index.decorator';

/**
 * Persists a single entity or multiple entities - saves or removes them.
 */
export class EntityPersistExecutor {
  private connection: Connection;

  private queryRunner: QueryRunner;

  private mode: 'save' | 'remove';

  private entityOrEntities: ObjectLiteral | ObjectLiteral[];

  constructor(args: {
    connection: Connection;
    queryRunner: QueryRunner;
    mode: 'save' | 'remove';
    entityOrEntities: ObjectLiteral | ObjectLiteral[];
  }) {
    this.connection = args.connection;
    this.queryRunner = args.queryRunner;
    this.mode = args.mode;
    this.entityOrEntities = args.entityOrEntities;
  }

  /**
   * Executes persistence operation of given entity or entities.
   */
  execute(): Promise<void> {
    if (!this.entityOrEntities || !(this.entityOrEntities instanceof Object)) throw new MustBeEntityError(this.mode, this.entityOrEntities);

    if (!Array.isArray(this.entityOrEntities)) return this.executeOne(this.entityOrEntities);
    else if (Array.isArray(this.entityOrEntities)) return this.executeMany(this.entityOrEntities);
  }

  async executeOne(entity: ObjectLiteral) {
    const target = entity.constructor;
    if (target === Object) throw new CannotDetermineEntityError(this.mode);

    const collectionMetadata = this.connection.getMetadata(target);
    const entityMetadata = collectionMetadata.getEntityMetadata(target);

    const entityToDocumentTransformer = new EntityToDocumentTransformer();

    if (this.mode === 'save') {
      // check if entity has relations
      const operations = [];
      let entityMetadatasWithEntities = [{ entityMetadata, entity }];
      while (entityMetadatasWithEntities.length !== 0) {
        const { entityMetadata, entity } = entityMetadatasWithEntities.pop();
        operations.push({ entityMetadata, entity: entity });
        if (entityMetadata.relationFields !== undefined) {
          entityMetadata.relationFields.forEach(relationField => {
            if (relationField.isCascade)
              entityMetadatasWithEntities.push({ entityMetadata: relationField.inverseEntityMetadata, entity: entity[relationField.entityKey] });
          });
        }
      }

      while (operations.length !== 0) {
        const { entityMetadata, entity } = operations.pop();

        if (Array.isArray(entity)) {
          const documents = entityToDocumentTransformer.transformAll(entity, entityMetadata);
          const documentsToInsert = documents.filter(document => !document._id);
          const documentsToUpdate = documents.filter(document => document._id);

          if (documentsToInsert.length > 0) {
            const { insertedIds } = await this.queryRunner.insertMany(entityMetadata.collectionMetadata.name, documentsToInsert);
            const entitiesWithoutIDs = entity.filter(entity => !entity[entityMetadata.objectIdField.entityKey]);
            entitiesWithoutIDs.forEach((entity, index) => (entity[entityMetadata.objectIdField.entityKey] = insertedIds[index]));
          }
          await Promise.all(
            documentsToUpdate.map(document => this.queryRunner.replaceOne(entityMetadata.collectionMetadata.name, { _id: document._id }, document))
          );
        } else {
          const document = entityToDocumentTransformer.transform(entity, entityMetadata);

          if (!document._id) {
            const { insertedId } = await this.queryRunner.insertOne(entityMetadata.collectionMetadata.name, document);
            if (!insertedId) return Promise.reject(new NoInsertedIdReturnedError());
            entity[entityMetadata.objectIdField.entityKey] = insertedId;
          } else {
            await this.queryRunner.replaceOne(entityMetadata.collectionMetadata.name, { _id: document._id }, document);
          }
        }
      }
    }
    if (this.mode === 'remove') {
      const operations = [];
      let entityMetadatasWithEntities = [{ entityMetadata, entity }];
      while (entityMetadatasWithEntities.length !== 0) {
        const { entityMetadata, entity } = entityMetadatasWithEntities.pop();
        operations.push({ entityMetadata, entity: entity });
        if (entityMetadata.relationFields !== undefined) {
          for (const relationField of entityMetadata.relationFields) {
            if (relationField.isCascade) {
              const id = entity[relationField.entityKey][relationField.inverseEntityMetadata.objectIdField.entityKey];
              let canBeDeleted = true;
              for (const reverseRelation of relationField.inverseEntityMetadata.reverseRelations) {
                const collectionName = reverseRelation.entityMetadata.collectionMetadata.name;
                const filterKey = reverseRelation.databaseKey;
                const results = await this.queryRunner.find(collectionName, { [filterKey]: new ObjectID(id) });
                if (entityMetadata.targetName === reverseRelation.entityMetadata.targetName) {
                  if (results.length > 1) canBeDeleted = false;
                } else {
                  if (results.length > 0) canBeDeleted = false;
                }
              }
              if (canBeDeleted)
                entityMetadatasWithEntities.push({ entityMetadata: relationField.inverseEntityMetadata, entity: entity[relationField.entityKey] });
            }
          }
        }
      }
      while (operations.length !== 0) {
        const { entityMetadata, entity } = operations.pop();

        await this.queryRunner.deleteOne(entityMetadata.collectionMetadata.name, {
          _id: entity[entityMetadata.objectIdField.entityKey]
        });
      }
    }
  }

  async executeMany(entities: ObjectLiteral[]) {
    for (const entity of entities) await this.executeOne(entity);
  }
}
