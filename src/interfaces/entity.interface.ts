import { ObjectID } from 'mongodb';

export interface Entity {
  // _id: ObjectID;
  // id: string;
  // [key: string]: any;
  new (...args: any[]): any;
}