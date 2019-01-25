import { IEntity } from '../interfaces/entity.interface';

export class Repository<Entity extends IEntity> {

  constructor(entity: string | IEntity[] | Entity) {

  }
}