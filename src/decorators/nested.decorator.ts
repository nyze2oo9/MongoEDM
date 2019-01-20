import { MetaDataStore } from '../store/metadata.store';
import { isUndefined } from 'lodash';
import { NestedMetaData } from '../classes/nested-metadata.class';
import { isArray } from 'lodash';
import { IType } from '../interfaces/type.interface';

export function Nested(types: IType[]): void;

export function Nested(typeFunction: () => any): void;

export function Nested(typesOrTypeFunction: (() => any) | IType[], inverseRelation?: string) {
  return function (object: Object, propertyKey: string) {
    const nestedMetaData = new NestedMetaData();
    nestedMetaData.target = object.constructor;
    nestedMetaData.propertyKey = propertyKey;
    if (isArray(typesOrTypeFunction)) nestedMetaData.types = typesOrTypeFunction;
    else nestedMetaData.typeFunction = typesOrTypeFunction;

    if (!isUndefined(inverseRelation)) nestedMetaData.inverseRelation = inverseRelation;

    MetaDataStore.nested.push(nestedMetaData);
  };
}