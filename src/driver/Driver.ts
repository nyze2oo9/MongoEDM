import { Connection } from '../connection/Connection';
import { IConnectionOptions } from '../connection/IConnectionOptions';
import Mongodb from 'mongodb';
import { ConnectionIsNotSetError } from '../error/ConnectionIsNotSetError';
import { QueryRunner } from '../query-runner/QueryRunner';

export class Driver {
  /**
   * Underlying mongodb library.
   */
  mongodb = Mongodb;

  /**
   * Master database used to perform all write queries.
   */
  database?: string;

  /**
   * Mongodb does not require to dynamically create query runner each time,
   * because it does not have a regular connection pool as RDBMS systems have.
   */
  queryRunner?: QueryRunner;

  /**
   * Connection options.
   */
  options: IConnectionOptions;

  constructor(protected connection: Connection) {
    this.options = connection.options;
  }

  /**
   * Performs connection to the database.
   */
  connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.mongodb.MongoClient.connect(this.options.uri, { useNewUrlParser: true }, (err: any, client: any) => {
        if (err) return reject(err);

        this.queryRunner = new QueryRunner(this.connection, client);
        this.queryRunner.manager = this.connection.manager;
        resolve();
      });
    });
  }

  /**
   * Closes connection with the database.
   */
  async disconnect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.queryRunner) return fail(new ConnectionIsNotSetError());

      const handler = (err: any) => (err ? reject(err) : resolve());
      this.queryRunner.databaseConnection.close(handler);
      this.queryRunner = undefined;
    });
  }

  /**
   * Creates a query runner used to execute database queries.
   */
  createQueryRunner(mode: 'master' | 'slave' = 'master') {
    return this.queryRunner!;
  }
}
