import { Document, FilterQuery } from 'mongoose';
import { UploadModel } from '../models';
import { IOptions } from '../interfaces';
import { IUpload } from '../interfaces/uploads';
import { IPaginationResult } from '../models/plugins/interfaces';

// Create a upload
const create = async (createBody: IUpload): Promise<IUpload> => {
  return await UploadModel.create(createBody);
};

// Get all uploads
const getAllUploads = async (options: IOptions, query: FilterQuery<Document>): Promise<IUpload[] | IPaginationResult<Document>> => {
  const uploads = await UploadModel.paginationAndDownload(options, query);

  return uploads;
};

// Delete upload by uploadId
const deleteUploadById = async (uploadId: string, updatedBy: string) => {
  const url = await UploadModel.softDelete(uploadId, updatedBy);

  return url;
};

export { create, deleteUploadById, getAllUploads };
