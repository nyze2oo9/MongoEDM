/**
 * Metadata args utility functions.
 */
export class MetadataUtils {
  /**
   * Gets given's entity all inherited classes.
   * Gives in order from parents to children.
   * For example Admin extends Person
   * [Admin, Person]
   */
  static getInheritanceTree(entity: Function): Function[] {
    const tree: Function[] = [entity];
    const getPrototypeOf = (object: Function): void => {
      const proto = Object.getPrototypeOf(object);
      if (proto && proto.name) {
        tree.push(proto);
        getPrototypeOf(proto);
      }
    };
    getPrototypeOf(entity);
    return tree;
  }
}
