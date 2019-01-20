import { MetaDataStore } from '../store/metadata.store';
import { isUndefined } from 'lodash';
import { isArray } from 'lodash';
import { RelationMetaData } from '../classes/relation-metadata.class';
import { IType } from '../interfaces/type.interface';

export function Relation(types: IType[]): void;

export function Relation(typeFunction: () => any): void;

export function Relation(typesOrTypeFunction: (() => any) | IType[], inverseRelation?: string) {
  return function (object: Object, propertyKey: string) {
    const relationMetaData = new RelationMetaData();
    relationMetaData.target = object.constructor;
    relationMetaData.propertyKey = propertyKey;
    if (isArray(typesOrTypeFunction)) relationMetaData.types = typesOrTypeFunction;
    else relationMetaData.typeFunction = typesOrTypeFunction;

    if (!isUndefined(inverseRelation)) relationMetaData.inverseRelation = inverseRelation;

    MetaDataStore.relations.push(relationMetaData);
  };
}