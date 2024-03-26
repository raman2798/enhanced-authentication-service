import { model, Schema } from 'mongoose';
import { paginationAndDownload, toJSON } from './plugins';
import { IUpload, IUploadModel } from '../interfaces/uploads';

const uploadSchema: Schema<IUpload> = new Schema<IUpload>(
  {
    title: { type: String, trim: true, required: true },
    filePath: { type: String, trim: true, required: true, private: true },
    fileName: { type: String, trim: true, required: true },
    type: { type: String, trim: true, required: true },
    ProjectId: {
      type: Schema.Types.ObjectId,
      ref: 'projects',
    },
    isActive: { type: Boolean, default: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

// add plugin pagination and download for populate
uploadSchema.plugin(paginationAndDownload);

// add plugin that converts mongoose to json
uploadSchema.plugin(toJSON);

uploadSchema.statics.softDelete = async function (id: string, updatedBy: string): Promise<IUpload> {
  const now = new Date();

  const result = await this.findByIdAndUpdate(id, { deletedAt: now, updatedBy });

  return result;
};

export default model<IUpload, IUploadModel>('uploads', uploadSchema);
