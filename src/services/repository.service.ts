/* import { IEntity } from '../interfaces/entity.interface';
import { IFindOneOptions } from '../interfaces/find-one-options.interface';
import { ObjectID } from 'mongodb';
import { isString, isUndefined, isArray, inspect } from 'util';
import { has } from 'lodash';
import { isClass } from '../utils/isClass';

export class Repository<Entity extends IEntity> {

  private collectionName: string;
  private entity: IEntity;
  private entities: IEntity[];

  constructor(collectionNameOrEntityOrEntityArray: string | IEntity[] | IEntity) {
    if (isString(collectionNameOrEntityOrEntityArray)) {
      const entity = MetaDataStore.getEntityByCollectionName(collectionNameOrEntityOrEntityArray);
      this.entity = entity.entity;
      this.collectionName = entity.collectionName;
    }
    if (Array.isArray(collectionNameOrEntityOrEntityArray)) {
      this.entities = collectionNameOrEntityOrEntityArray;
      this.collectionName = MetaDataStore.getCollectionNameFromEntities(this.entities);
    }
    if (isClass(collectionNameOrEntityOrEntityArray)) {
      this.entity = collectionNameOrEntityOrEntityArray as IEntity;
      this.collectionName = MetaDataStore.getCollectionNameFromEntity(this.entity);
    }
    if (isUndefined(this.collectionName)) throw new Error('couldn\'t find collection');
  }

/*   public async findById(_id: string, options?: IFindOneOptions): Promise<InstanceType<Entity>> {
    return this.findOne({ _id: new ObjectID(_id) }, options);
  }

  public async findOne(filter: any, options: IFindOneOptions = {}): Promise<InstanceType<Entity>> {
    const { collectionName, entity } = this.collection;

    const { projection } = options;
    const objectFromDB = await this.databaseConnector.connection.collection(collectionName).findOne(filter, { projection });
    if (objectFromDB === null) {
      return undefined;
    }

    const transformer = new DocumentToEntityTransformer({
      keys: 'fieldName'
    });
    const entityInstace = transformer.transform(objectFromDB, entity);

    return entityInstace;
  }
} */