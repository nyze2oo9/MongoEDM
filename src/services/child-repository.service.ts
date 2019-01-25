import { IEntity } from '../interfaces/entity.interface';

export class ChildRepository<Entity extends IEntity> {
  constructor(entityOrEntities: Entity | IEntity[], collectionNameOrParentEntityOrParentEntities?: string | IEntity | IEntity[]) {

  }
}