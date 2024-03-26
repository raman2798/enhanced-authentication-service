import { Document, FilterQuery, Model, Schema } from 'mongoose';
import { IOptionsWithPopulate } from './index';
import { Gender } from '../enums/users';
import { Status } from '../enums';
import { IPaginationResult } from '../models/plugins/interfaces';

export interface IUser extends Document {
  email: string;
  isEmailVerified: boolean;
  name: IName;
  password: string;
  gender: Gender;
  RoleIds: Schema.Types.ObjectId[];
  status: Status;
  isPasswordMatch(password: string): Promise<boolean>;
  isPending: boolean;
  isActive: boolean;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}

export interface IName {
  first: string;
  last: string;
}

export interface IUserModel extends Model<IUser> {
  isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
  paginationAndDownload(options: IOptionsWithPopulate, query?: FilterQuery<Document>): Promise<IPaginationResult<Document>>;
}
