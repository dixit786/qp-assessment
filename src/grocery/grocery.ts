import { Model, model, Schema } from 'mongoose';

import { ERROR_MESSAGES } from '../constants';

// import { IRole, RoleModel, RoleDocument } from '../utils/interfaces/role.interface';
import { groceryDocument, groceryModel } from '../utils/interfaces/grocery.interface';

const grocerySchema = new Schema<groceryDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      required: true,
    },
    price: {
        type: Number
    }
  },
  { timestamps: true },
);

export default model<groceryDocument, groceryModel>('grocery', grocerySchema);
