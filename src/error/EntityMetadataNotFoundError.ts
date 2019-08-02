/**
 */
export class EntityMetadataNotFoundError extends Error {
  name = 'EntityMetadataNotFound';

  constructor(target: Function | string) {
    super();
    let targetName: string;
    if (typeof target === 'function') {
      targetName = target.name;
    } else {
      targetName = target;
    }
    this.message = `No metadata for "${targetName}" was found.`;
  }
}
