import { getMetadataArgsStorage } from '..';

export function Entity(collectionName?: string) {
  return function(target: Function) {
    collectionName =
      typeof collectionName === 'string' && collectionName !== '' ? collectionName : target.name.toLowerCase();

    const filteredCollection = getMetadataArgsStorage().collections.find(
      collection => collection.name === collectionName
    );
    if (!filteredCollection) {
      getMetadataArgsStorage().collections.push({
        name: collectionName,
        entities: [target]
      });
    } else {
      filteredCollection.entities.push(target);
    }
  };
}
