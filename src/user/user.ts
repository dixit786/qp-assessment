import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { Model, model, Schema } from 'mongoose';
import { IUser, UserDocument } from '../utils/interfaces/user.interface';

const userSchema = new Schema<UserDocument>(
  {
    name: String,
    email: {
      type: String,
      unique: true
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'role',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true
    },
    password: String,
    cart: [
      {
        grocery: {
          type: Schema.Types.ObjectId,
          ref: 'grocery',
          required: true,
        },
        quantity: {
          type: Number,
          default: 1
        }, 
      }
    ]
  },
  { timestamps: true },
);

export const UserModelFromOtherDB = model('User', userSchema);

// export default model<UserDocument, UserModel>('User', userSchema);
