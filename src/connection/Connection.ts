import { IConnectionOptions } from './IConnectionOptions';
import { Driver } from '../driver/Driver';
import { EntityManager } from '../entity-manager/EntityManager';
import { CannotConnectAlreadyConnectedError } from '../error/CannotConnectAlreadyConnectedError';
import { CannotExecuteNotConnectedError } from '../error/CannotExecuteNotConnectedError';
import { TransformFunctionBuilder as TransformFunctionsBuilder } from '../transform-function-builder/TransformFunctionBuilder';
import { ConnectionMetadataBuilder } from './ConnectionMetadataBuilder';
import { EntityMetadata } from '../metadata/EntityMetadata';
import { CollectionMetadata } from '../metadata/CollectionMetadata';
import { EntityMetadataNotFoundError } from '../error/EntityMetadataNotFoundError';
import { QueryRunner } from '../query-runner/QueryRunner';

export class Connection {
  /**
   * Connection options.
   */
  readonly options: IConnectionOptions;

  /**
   * Indicates if connection is initialized or not.
   */
  private _isConnected: boolean;
  get isConnected(): boolean {
    return this._isConnected;
  }

  /**
   * Database driver used by this connection.
   */
  readonly driver: Driver;

  /**
   * EntityManager of this connection.
   */
  readonly manager: EntityManager;

  /**
   * All collection metadatas that are registered for this connection.
   */
  private _collectionMetadatas: CollectionMetadata[] = [];
  get collectionMetadatas(): CollectionMetadata[] {
    return this._collectionMetadatas;
  }

  constructor(options: IConnectionOptions) {
    this.options = options;
    this.driver = new Driver(this);
    this.manager = new EntityManager(this);
    this._isConnected = false;
  }

  async connect(): Promise<this> {
    if (this.isConnected) throw new CannotConnectAlreadyConnectedError();

    // connect to mongodb via the driver
    await this.driver.connect();

    this._isConnected = true;

    try {
      // build all metadatas registered in the current connection
      this.buildMetadatas();

      this.buildTransformerFunctions();
    } catch (error) {
      await this.close();
      throw error;
    }

    return this;
  }

  async close(): Promise<void> {
    if (!this.isConnected) throw new CannotExecuteNotConnectedError();

    await this.driver.disconnect();

    this._isConnected = false;
  }

  protected buildMetadatas(): void {
    const connectionMetadataBuilder = new ConnectionMetadataBuilder(this);
    //const entityMetadataValidator = new EntityMetadataValidator();

    // build entity metadatas
    this._collectionMetadatas = connectionMetadataBuilder.buildCollectionMetadatas(this.options.entities || []);

    // validate all created entity metadatas to make sure user created entities are valid and correct
    // entityMetadataValidator.validateMany(this.entityMetadatas.filter(metadata => metadata.tableType !== "view"), this.driver);
  }

  /**
   * Finds exist collection metadata by the given entity class or collection name.
   */
  protected findMetadata(targetOrTargetName: Function | string): CollectionMetadata | undefined {
    return this.collectionMetadatas.find(metadata => {
      if (typeof targetOrTargetName === 'function' && metadata.targets.includes(targetOrTargetName)) return true;
      if (typeof targetOrTargetName === 'string' && metadata.name == targetOrTargetName) return true;

      return false;
    });
  }

  /**
   * Gets entity metadata for the given entity class or collection name
   */
  getMetadata(targetOrTargetName: Function | string): CollectionMetadata {
    const metadata = this.findMetadata(targetOrTargetName);
    if (!metadata) throw new EntityMetadataNotFoundError(targetOrTargetName);

    return metadata;
  }

  buildTransformerFunctions() {
    const transformFunctionsBuilder = new TransformFunctionsBuilder();

    //getMetadataArgsStorage().toEntityTransformFunctions = transformFunctionsBuilder.build(getMetadataArgsStorage());
  }
}
