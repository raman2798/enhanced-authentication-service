import { Document, FilterQuery, Model, Schema } from 'mongoose';
import { IOptionsWithPopulate } from './index';
import { IPaginationResult } from '../models/plugins/interfaces';

export interface IRole extends Document {
  title: string;
  type: string;
  description: string;
  isActive: boolean;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}

export interface IRoleModel extends Model<IRole> {
  paginationAndDownload(options: IOptionsWithPopulate, query?: FilterQuery<Document>): Promise<IPaginationResult<Document>>;
}
