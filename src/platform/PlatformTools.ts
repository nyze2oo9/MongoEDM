import * as path from 'path';

export class PlatformTools {
  /**
   * Loads ("require"-s) given file or package.
   * This operation only supports on node platform
   */
  static load(name: string): any {
    // if name is not absolute or relative, then try to load package from the node_modules of the directory we are currently in
    // this is useful when we are using typeorm package globally installed and it accesses drivers
    // that are not installed globally

    try {
      // switch case to explicit require statements for webpack compatibility.

      switch (name) {
        case 'glob':
          return require('glob');

        /**
         * default
         */
        default:
          return require(name);
      }
    } catch (err) {
      if (!path.isAbsolute(name) && name.substr(0, 2) !== './' && name.substr(0, 3) !== '../') {
        return require(path.resolve(process.cwd() + '/node_modules/' + name));
      }

      throw err;
    }
  }

  /**
   * Normalizes given path. Does "path.normalize".
   */
  static pathNormalize(pathStr: string): string {
    return path.normalize(pathStr);
  }

  /**
   * Gets file extension. Does "path.extname".
   */
  static pathExtname(pathStr: string): string {
    return path.extname(pathStr);
  }

  /**
   * Resolved given path. Does "path.resolve".
   */
  static pathResolve(pathStr: string): string {
    return path.resolve(pathStr);
  }
}
