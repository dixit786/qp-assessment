import { Model, model, Schema } from 'mongoose';
// import { IRole, RoleModel, RoleDocument } from '../utils/interfaces/role.interface';
import { categoryDocument, categoryModel } from '../utils/interfaces/category.schema';

const categorySchema = new Schema<categoryDocument>(
  {
    name: {
      type: String,
      required: true,
    }
  },
  { timestamps: true },
);

export default model<categoryDocument, categoryModel>('category', categorySchema);
