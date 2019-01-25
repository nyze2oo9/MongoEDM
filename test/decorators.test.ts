import { ChildEntity, Entity, Field, Nested, Relation } from '../src';
import { MetaDataStore } from '../src/store/metadata.store';
import { isArray } from 'util';

class Root { }
class Test { }

test('should save child entity to store', () => {
  ChildEntity()(Test);
  expect(MetaDataStore.childEntities.length).toBe(1);
  expect(MetaDataStore.childEntities[0].entity).toBe(Test);
  MetaDataStore.childEntities = [];
});

test('should save child entity with single rootDocumentFunction to store', () => {
  ChildEntity(() => Root)(Test);
  expect(MetaDataStore.childEntities.length).toBe(1);
  expect(MetaDataStore.childEntities[0].entity).toBe(Test);
  const rootDocumentFunction = MetaDataStore.childEntities[0].parentDocumentFunction;
  let rootDocument;
  if (rootDocumentFunction !== undefined && !isArray(rootDocumentFunction)) rootDocument = rootDocumentFunction();
  expect(rootDocument).toBe(Root);
  MetaDataStore.childEntities = [];
});

test('should save child entity with rootDocumentFunction array to store', () => {
  ChildEntity([() => Root, () => Root])(Test);
  expect(MetaDataStore.childEntities.length).toBe(1);
  expect(MetaDataStore.childEntities[0].entity).toBe(Test);
  const rootDocumentFunctionArray = MetaDataStore.childEntities[0].parentDocumentFunction;
  let rootDocumentArray;
  if (rootDocumentFunctionArray !== undefined && isArray(rootDocumentFunctionArray)) rootDocumentArray = rootDocumentFunctionArray.map(rootDocumentFunction => rootDocumentFunction());
  expect(rootDocumentArray).toEqual([Root, Root]);
  MetaDataStore.childEntities = [];
});

test('should save entity to store', () => {
  Entity()(Root);
  expect(MetaDataStore.entities.length).toBe(1);
  expect(MetaDataStore.entities[0].entity).toBe(Root);
  expect(MetaDataStore.entities[0].collectionName).toBe('root');
  MetaDataStore.entities = [];
});

test('should save entity with custom collectionName to store', () => {
  Entity('roots')(Root);
  expect(MetaDataStore.entities.length).toBe(1);
  expect(MetaDataStore.entities[0].entity).toBe(Root);
  expect(MetaDataStore.entities[0].collectionName).toBe('roots');
  MetaDataStore.entities = [];
});

test('should save field to store', () => {
  Field()(Root, 'propertyKey');
  expect(MetaDataStore.fields.length).toBe(1);
  expect(MetaDataStore.fields[0].target).toBe(Root);
  expect(MetaDataStore.fields[0].propertyKey).toBe('propertyKey');
  expect(MetaDataStore.fields[0].fieldName).toBe(undefined);
  MetaDataStore.fields = [];
});

test('should save field with fieldName to store', () => {
  Field('fieldName')(Root, 'propertyKey');
  expect(MetaDataStore.fields.length).toBe(1);
  expect(MetaDataStore.fields[0].target).toBe(Root);
  expect(MetaDataStore.fields[0].propertyKey).toBe('propertyKey');
  expect(MetaDataStore.fields[0].fieldName).toBe('fieldName');
  MetaDataStore.fields = [];
});

test('should save nested with typeFunction to store', () => {
  Nested(() => Test)(Root, 'propertyKey');
  expect(MetaDataStore.nested.length).toBe(1);
  expect(MetaDataStore.nested[0].target).toBe(Root);
  expect(MetaDataStore.nested[0].propertyKey).toBe('propertyKey');
  expect(MetaDataStore.nested[0].typeFunction()).toBe(Test);
  expect(MetaDataStore.nested[0].types).toBe(undefined);
  MetaDataStore.nested = [];
});

test('should save nested with types to store', () => {
  Nested([
    {
      typeFunction: () => Test,
      conditionFunction: () => true
    }
  ])(Root, 'propertyKey');
  expect(MetaDataStore.nested.length).toBe(1);
  expect(MetaDataStore.nested[0].target).toBe(Root);
  expect(MetaDataStore.nested[0].propertyKey).toBe('propertyKey');
  expect(MetaDataStore.nested[0].typeFunction).toBe(undefined);

  const type = MetaDataStore.nested[0].types[0].typeFunction();
  const condition = MetaDataStore.nested[0].types[0].conditionFunction(undefined);
  expect(type).toBe(Test);
  expect(condition).toBe(true);

  MetaDataStore.nested = [];
});

test('should save relation with typeFunction to store', () => {
  Relation(() => Test)(Root, 'propertyKey');
  expect(MetaDataStore.relations.length).toBe(1);
  expect(MetaDataStore.relations[0].target).toBe(Root);
  expect(MetaDataStore.relations[0].propertyKey).toBe('propertyKey');
  expect(MetaDataStore.relations[0].typeFunction()).toBe(Test);
  expect(MetaDataStore.relations[0].types).toBe(undefined);
  MetaDataStore.relations = [];
});

test('should save nested with types to store', () => {
  Relation([
    {
      typeFunction: () => Test,
      conditionFunction: () => true
    }
  ])(Root, 'propertyKey');
  expect(MetaDataStore.relations.length).toBe(1);
  expect(MetaDataStore.relations[0].target).toBe(Root);
  expect(MetaDataStore.relations[0].propertyKey).toBe('propertyKey');
  expect(MetaDataStore.relations[0].typeFunction).toBe(undefined);

  const type = MetaDataStore.relations[0].types[0].typeFunction();
  const condition = MetaDataStore.relations[0].types[0].conditionFunction(undefined);
  expect(type).toBe(Test);
  expect(condition).toBe(true);

  MetaDataStore.relations = [];
});