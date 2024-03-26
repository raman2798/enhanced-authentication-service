import { Document, FilterQuery, Model, Schema } from 'mongoose';
import { IOptionsWithPopulate } from './index';
import { IPaginationResult } from '../models/plugins/interfaces';

export interface IUpload extends Document {
  title: string;
  filePath: string;
  fileName: string;
  type: string;
  ProjectId: Schema.Types.ObjectId;
  isActive: boolean;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
  deletedAt: Date;
}

export interface IUploadModel extends Model<IUpload> {
  softDelete(id: string, updatedBy: string): Promise<IUpload>;
  paginationAndDownload(options: IOptionsWithPopulate, query?: FilterQuery<Document>): Promise<IPaginationResult<Document>>;
}
