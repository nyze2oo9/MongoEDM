
import { IEntity } from '../interfaces/entity.interface';
import { Repository } from '../services/repository.service';

export function getRepository<Entity extends IEntity>(collectionName: string): Repository<Entity>;
export function getRepository<Entity extends IEntity>(entity: IEntity[]): Repository<Entity>;
export function getRepository<Entity extends IEntity>(entity: Entity): Repository<Entity>;
export function getRepository<Entity extends IEntity>(collectionNameOrEntityOrEntityArray: string | IEntity[] | Entity): Repository<Entity> {
  return new Repository(collectionNameOrEntityOrEntityArray);
}