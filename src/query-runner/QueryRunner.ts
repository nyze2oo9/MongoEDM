import { Connection } from '../connection/Connection';
import { EntityManager } from '../entity-manager/EntityManager';
import {
  MongoClient,
  Collection,
  Cursor,
  InsertWriteOpResult,
  InsertOneWriteOpResult,
  CollectionInsertManyOptions,
  CollectionInsertOneOptions,
  UpdateWriteOpResult,
  ReplaceOneOptions,
  UpdateOneOptions,
  UpdateManyOptions,
  CommonOptions,
  DeleteWriteOpResultObject
} from 'mongodb';
import { ObjectLiteral } from '../common/ObjectLiteral';

export class QueryRunner {
  /**
   * Connection used by this query runner.
   */
  connection: Connection;

  /**
   * Entity manager working only with current query runner.
   */
  manager: EntityManager;

  /**
   * Real database connection from a connection pool used to perform queries.
   */
  databaseConnection: MongoClient;

  constructor(connection: Connection, databaseConnection: MongoClient) {
    this.connection = connection;
    this.databaseConnection = databaseConnection;
  }

  /**
   * Finds documents in MongoDB collection
   */
  find(collectionName: string, query?: ObjectLiteral): Promise<any[]> {
    return this.getCollection(collectionName)
      .find(query || {})
      .toArray();
  }

  /**
   * Inserts an array of documents into MongoDB.
   */
  async insertMany(collectionName: string, docs: ObjectLiteral[], options?: CollectionInsertManyOptions): Promise<InsertWriteOpResult> {
    return await this.getCollection(collectionName).insertMany(docs, options);
  }

  /**
   * Inserts a single document into MongoDB.
   */
  async insertOne(collectionName: string, doc: ObjectLiteral, options?: CollectionInsertOneOptions): Promise<InsertOneWriteOpResult> {
    return await this.getCollection(collectionName).insertOne(doc, options);
  }

  /**
   * Update multiple documents on MongoDB.
   */
  async updateMany(collectionName: string, query: ObjectLiteral, update: ObjectLiteral, options?: UpdateManyOptions): Promise<UpdateWriteOpResult> {
    return await this.getCollection(collectionName).updateMany(query, update, options);
  }

  /**
   * Update a single document on MongoDB.
   */
  async updateOne(collectionName: string, query: ObjectLiteral, update: ObjectLiteral, options?: UpdateOneOptions): Promise<UpdateWriteOpResult> {
    return await this.getCollection(collectionName).updateOne(query, update, options);
  }

  /**
   * Replace a document on MongoDB.
   */
  async replaceOne(collectionName: string, query: ObjectLiteral, doc: ObjectLiteral, options?: ReplaceOneOptions): Promise<UpdateWriteOpResult> {
    return await this.getCollection(collectionName).replaceOne(query, doc, options);
  }

  /**
   * Delete multiple documents on MongoDB.
   */
  async deleteMany(collectionName: string, query: ObjectLiteral, options?: CommonOptions): Promise<DeleteWriteOpResultObject> {
    return await this.getCollection(collectionName).deleteMany(query, options);
  }

  /**
   * Delete a document on MongoDB.
   */
  async deleteOne(collectionName: string, query: ObjectLiteral, options?: CommonOptions): Promise<DeleteWriteOpResultObject> {
    return await this.getCollection(collectionName).deleteOne(query, options);
  }

  /**
   * Creates a cursor for a query that can be used to iterate over results from MongoDB.
   */
  // cursor(collectionName: string, query?: ObjectLiteral): Cursor<any> {
  //   return this.getCollection(collectionName).find(query || {});
  // }

  /**
   * Execute an aggregation framework pipeline against the collection.
   */
  // aggregate(
  //   collectionName: string,
  //   pipeline: ObjectLiteral[],
  //   options?: CollectionAggregationOptions
  // ): AggregationCursor<any> {
  //   return this.getCollection(collectionName).aggregate(pipeline, options);
  // }

  protected getCollection(collectionName: string): Collection<any> {
    return this.databaseConnection.db(this.connection.driver.database!).collection(collectionName);
  }

  /**
   * Creates a cursor for a query that can be used to iterate over results from MongoDB.
   */
  cursor(collectionName: string, query?: ObjectLiteral): Cursor<any> {
    return this.getCollection(collectionName).find(query || {});
  }
}
