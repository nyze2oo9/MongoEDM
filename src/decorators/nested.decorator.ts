import { MetaDataStore } from '../store/metadata.store';
import { isUndefined } from 'lodash';
import { NestedMetaData } from '../classes/nested-metadata.class';
import { isArray } from 'lodash';
import { IType } from '../interfaces/type.interface';

export function Nested(types: IType[]): any;

export function Nested(typeFunction: () => any): any;

export function Nested(typesOrTypeFunction: (() => any) | IType[]) {
  return function (object: Object, propertyKey: string) {
    const nestedMetaData = new NestedMetaData();
    nestedMetaData.target = object;
    nestedMetaData.propertyKey = propertyKey;
    if (isArray(typesOrTypeFunction)) nestedMetaData.types = typesOrTypeFunction;
    else nestedMetaData.typeFunction = typesOrTypeFunction;

    MetaDataStore.nested.push(nestedMetaData);
  };
}