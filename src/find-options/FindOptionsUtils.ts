import { FindManyOptions } from './FindManyOptions';
import { FindOneOptions } from './FindOneOptions';

/**
 * Utilities to work with FindOptions.
 */
export class FindOptionsUtils {
  /**
   * Checks if given object is really instance of FindManyOptions interface.
   */
  static isFindManyOptions(obj: any): obj is FindManyOptions<any> {
    const possibleOptions: FindManyOptions<any> = obj;
    return (
      possibleOptions &&
      (this.isFindOneOptions(possibleOptions) ||
        typeof (possibleOptions as FindManyOptions<any>).skip === 'number' ||
        typeof (possibleOptions as FindManyOptions<any>).take === 'number')
    );
  }

  static isFindOneOptions(obj: any): obj is FindOneOptions<any> {
    const possibleOptions: FindOneOptions<any> = obj;
    return (
      possibleOptions &&
      (possibleOptions.project instanceof Array ||
        possibleOptions.query instanceof Object ||
        possibleOptions.relations instanceof Array ||
        possibleOptions.order instanceof Object)
    );
  }
}
