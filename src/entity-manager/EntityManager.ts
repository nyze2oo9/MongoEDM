import { Connection } from '../connection/Connection';
import { QueryRunner } from '../query-runner/QueryRunner';
import { FindManyOptions } from '../find-options/FindManyOptions';
import { ObjectType } from '../common/ObjectType';
import { ObjectLiteral } from '../common/ObjectLiteral';
import { FindOptionsUtils } from '../find-options/FindOptionsUtils';
import { Cursor, AggregationCursor, MongoCallback, MongoError, CursorResult } from 'mongodb';
import { CollectionMetadata } from '../metadata/CollectionMetadata';
import { DocumentToEntityTransformer } from '../query-builder/transformer/DocumentToEntityTransformer';
import { DeepPartial } from '../common/DeepPartial';
import { EntityPersistExecutor } from '../persistence/EntityPersistExecutor';

export class EntityManager {
  /**
   * Connection used by this entity manager.
   */
  readonly connection: Connection;

  /**
   * Once created and then reused by en repositories.
   */
  //protected repositories: Repository<any>[] = [];

  constructor(connection: Connection, queryRunner?: QueryRunner) {
    this.connection = connection;
  }

  /**
   * Gets query runner used to execute queries.
   */
  get queryRunner(): QueryRunner {
    return this.connection.driver.queryRunner;
  }

  /**
   * Saves all given entities in the database.
   * If entities do not exist in the database then inserts, otherwise updates.
   */
  save<Entity>(entities: Entity[]): Promise<Entity[]>;

  /**
   * Saves all given entities in the database.
   * If entities do not exist in the database then inserts, otherwise updates.
   */
  save<Entity>(entity: Entity): Promise<Entity>;

  /**
   * Saves a given entity in the database.
   */
  async save<Entity, T extends DeepPartial<Entity>>(entityOrEntities: T | T[]): Promise<T | T[]> {
    // execute save operation
    const entityPersistExecutor = new EntityPersistExecutor({
      connection: this.connection,
      queryRunner: this.queryRunner,
      mode: 'save',
      entityOrEntities
    });
    await entityPersistExecutor.execute();
    return entityOrEntities;
  }

  /**
   * Removes a given entity from the database.
   */
  remove<Entity>(entity: Entity): Promise<Entity>;

  /**
   * Removes a given entity from the database.
   */
  remove<Entity>(entity: Entity[]): Promise<Entity>;

  /**
   * Removes a given entity from the database.
   */
  async remove<Entity>(entityOrEntities: Entity | Entity[]): Promise<Entity | Entity[]> {
    // execute save operation
    const entityPersistExecutor = new EntityPersistExecutor({
      connection: this.connection,
      queryRunner: this.queryRunner,
      mode: 'remove',
      entityOrEntities
    });
    await entityPersistExecutor.execute();
    return entityOrEntities;
  }

  /**
   * Finds entities that match given find options or conditions.
   */
  async find<Entity>(
    entityClassOrName: ObjectType<Entity> | string,
    optionsOrConditions?: FindManyOptions<Entity> | Partial<Entity>
  ): Promise<Entity[]> {
    const query = this.convertFindManyOptionsOrConditionsToMongodbQuery(optionsOrConditions);
    const cursor = await this.createEntityCursor(entityClassOrName, query);
    if (FindOptionsUtils.isFindManyOptions(optionsOrConditions)) {
      if (optionsOrConditions.project) cursor.project(optionsOrConditions.project);
      if (optionsOrConditions.skip) cursor.skip(optionsOrConditions.skip);
      if (optionsOrConditions.take) cursor.limit(optionsOrConditions.take);
      if (optionsOrConditions.order) cursor.sort(optionsOrConditions.order);
    }
    return cursor.toArray();
  }

  /**
   * Converts FindManyOptions to mongodb query.
   */
  protected convertFindManyOptionsOrConditionsToMongodbQuery<Entity>(
    optionsOrConditions: FindManyOptions<Entity> | Partial<Entity> | undefined
  ): ObjectLiteral | undefined {
    if (!optionsOrConditions) return undefined;

    if (FindOptionsUtils.isFindManyOptions(optionsOrConditions)) return optionsOrConditions.query;

    return optionsOrConditions;
  }

  /**
   * Creates a cursor for a query that can be used to iterate over results from MongoDB.
   * This returns modified version of cursor that transforms each result into Entity model.
   */
  createEntityCursor<Entity>(entityClassOrName: ObjectType<Entity> | string, query?: ObjectLiteral): Cursor<Entity> {
    const metadata = this.connection.getMetadata(entityClassOrName);
    const cursor = this.createCursor(entityClassOrName, query);
    this.applyEntityTransformationToCursor(metadata, cursor);
    return cursor;
  }

  /**
   * Creates a cursor for a query that can be used to iterate over results from MongoDB.
   */
  createCursor<Entity, T = any>(entityClassOrName: ObjectType<Entity> | string, query?: ObjectLiteral): Cursor<T> {
    const metadata = this.connection.getMetadata(entityClassOrName);
    return this.queryRunner.cursor(metadata.name, query);
  }

  /**
   * Overrides cursor's toArray and next methods to convert results to entity automatically.
   */
  protected applyEntityTransformationToCursor<Entity>(
    metadata: CollectionMetadata,
    cursor: Cursor<Entity> | AggregationCursor<Entity>
  ) {
    const ParentCursor = Cursor;
    cursor.toArray = function(callback?: MongoCallback<Entity[]>) {
      if (callback) {
        ParentCursor.prototype.toArray.call(
          this,
          (error: MongoError, results: Entity[]): void => {
            if (error) {
              callback(error, results);
              return;
            }

            const transformer = new DocumentToEntityTransformer();
            const entities = transformer.transformAll(results, metadata);

            callback(error, entities);
          }
        );
      } else {
        return (<any>ParentCursor.prototype.toArray).call(this).then((results: Entity[]) => {
          const transformer = new DocumentToEntityTransformer();
          const entities = transformer.transformAll(results, metadata);

          return entities;
        });
      }
    };
    cursor.next = function(callback?: MongoCallback<CursorResult>) {
      if (callback) {
        ParentCursor.prototype.next.call(
          this,
          (error: MongoError, result: CursorResult): void => {
            if (error || !result) {
              callback(error, result);
              return;
            }

            const transformer = new DocumentToEntityTransformer();
            const entity = transformer.transform(result, metadata);

            callback(error, entity);
          }
        );
      } else {
        return (<any>ParentCursor.prototype.next).call(this).then((result: Entity) => {
          if (!result) return result;

          const transformer = new DocumentToEntityTransformer();
          const entity = transformer.transform(result, metadata);

          return entity;
        });
      }
    };
  }
}
