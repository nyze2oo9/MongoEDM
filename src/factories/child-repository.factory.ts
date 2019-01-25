import { IEntity } from '../interfaces/entity.interface';
import { ChildRepository } from '../services/child-repository.service';

export function getChildRepository<Entity extends IEntity>(entities: IEntity[], collectionName: string): ChildRepository<Entity>;
export function getChildRepository<Entity extends IEntity>(entities: IEntity[], parentEntity: IEntity): ChildRepository<Entity>;
export function getChildRepository<Entity extends IEntity>(entities: IEntity[], parentEntities: IEntity[]): ChildRepository<Entity>;
export function getChildRepository<Entity extends IEntity>(entities: IEntity[]): ChildRepository<Entity>;
export function getChildRepository<Entity extends IEntity>(entity: Entity, parentEntity: IEntity): ChildRepository<Entity>;
export function getChildRepository<Entity extends IEntity>(entity: Entity, parentEntities: IEntity[]): ChildRepository<Entity>;
export function getChildRepository<Entity extends IEntity>(entity: Entity, collectionName: string): ChildRepository<Entity>;
export function getChildRepository<Entity extends IEntity>(entity: Entity): ChildRepository<Entity>;
export function getChildRepository<Entity extends IEntity>(entityOrEntities: Entity | IEntity[], collectionNameOrParentEntityOrParentEntities?: string | IEntity | IEntity[]): ChildRepository<Entity> {
  return new ChildRepository(entityOrEntities, collectionNameOrParentEntityOrParentEntities);
}