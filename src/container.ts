export type ContainedType<T> = { new (...args: any[]): T } | Function;

export interface ContainerInterface {
  get<T>(someClass: ContainedType<T>, cb?: (arg0: this) => T): T;
}

class Container implements ContainerInterface {
  private instances: { type: Function; object: any }[] = [];

  get<T>(someClass: ContainedType<T>, cb?: (arg0: this) => T): T {
    let instance = this.instances.find(i => i.type === someClass);
    if (!instance) {
      instance = { type: someClass, object: cb(this) };
      this.instances.push(instance);
    }

    return instance.object;
  }
}

/**
 * Container to be used by this library for inversion control. If container was not implicitly set then by default
 * container simply creates a new instance of the given class.
 */
export const defaultContainer = new Container();

/**
 * Gets the IOC container used by this library.
 */
export function getFromContainer<T>(someClass: ContainedType<T>, cb?: (arg0: InstanceType<any>) => T): T {
  return defaultContainer.get<T>(someClass, cb);
}

