import { ObjectLiteral } from '../common/ObjectLiteral';

/**
 * Defines a special criteria to find specific entity.
 */
export interface FindOneOptions<Entity = any> {
  /**
   * Specifies what columns should be retrieved.
   */
  project?: { [P in keyof Entity]?: 1 | 0 };

  /**
   * Simple condition that should be applied to match entities.
   */
  query?: ObjectLiteral;

  /**
   * Indicates what relations of entity should be loaded.
   */
  relations?: string[];

  /**
   * Order, in which entities should be ordered.
   */
  order?: { [P in keyof Entity]?: 1 | -1 };
}
