import { ObjectID } from 'mongodb';

export interface IEntity {
  // _id: ObjectID;
  // id: string;
  // [key: string]: any;
  new (...args: any[]): any;
}