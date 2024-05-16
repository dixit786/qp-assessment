import { Model, model, Schema } from 'mongoose';

import { ERROR_MESSAGES } from '../constants';

import { IRole, RoleModel, RoleDocument } from '../utils/interfaces/role.interface';

const roleSchema = new Schema<RoleDocument>(
  {
    roleName: {
      type: String,
      required: true,
      unique: true,
    }
  },
  { timestamps: true },
);

export default model<RoleDocument, RoleModel>('role', roleSchema);
