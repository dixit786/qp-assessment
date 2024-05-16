import { Document, Model, Schema } from 'mongoose';

export interface IUser {
  _id?: Schema.Types.ObjectId | string;
  name: string,
  email: string,
  isActive: boolean,
  password: string,
  role: Schema.Types.ObjectId | string,
  cart: [
    {
      grocery: Schema.Types.ObjectId | string,
      quantity: number, 
    }
  ]
}

export interface UserDocument extends IUser, Document {
  _id?: Schema.Types.ObjectId | string;
  getFullName(): string;
}

export interface UserModel extends Model<UserDocument> {
  createUser(userDetails: IUser): Promise<UserDocument>;
  getUserById(id: string): Promise<UserDocument>;
  getUsers(pipeline: any, query: any): Promise<UserDocument>;
  deleteUserById(id: string): Promise<UserDocument>;
  updatedUserById(id: string, userDetails: IUser): Promise<UserDocument>;
}
