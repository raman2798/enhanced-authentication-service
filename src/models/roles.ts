import { model, Schema } from 'mongoose';
import { paginationAndDownload, toJSON } from './plugins';
import { IRole, IRoleModel } from '../interfaces/roles';

const roleSchema: Schema<IRole> = new Schema<IRole>(
  {
    title: { type: String, trim: true, required: true },
    type: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    isActive: { type: Boolean, default: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  {
    timestamps: true,
  },
);

// add plugin pagination and download for populate
roleSchema.plugin(paginationAndDownload);

// add plugin that converts mongoose to json
roleSchema.plugin(toJSON);

export default model<IRole, IRoleModel>('roles', roleSchema);
