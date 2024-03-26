import { NextFunction, Request, Response } from 'express';
import { floor, get, isEqual, toNumber } from 'lodash';
import { uploadService } from '../services';
import { transformErrorUtils, transformResponseUtils } from '../utils';
import { IOptions } from '../interfaces';
import { IUpload } from '../interfaces/uploads';

const { create, deleteUploadById, getAllUploads } = uploadService;

const createUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createBody = { ...get(req, 'body'), filePath: get(req, 'filePath'), fileName: get(req, 'fileName'), createdBy: get(req, 'user.id') } as IUpload;

    const upload = await create(createBody);

    res.json(
      transformResponseUtils({
        result: upload,
      }),
    );
  } catch (error) {
    next(transformErrorUtils(error));
  }
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      params: { uploadId },
    } = req;

    const userId = get(req, 'user.id') as string;

    const upload = await deleteUploadById(uploadId, userId);

    res.json(
      transformResponseUtils({
        result: upload,
      }),
    );
  } catch (error) {
    next(transformErrorUtils(error));
  }
};

const readAllUploads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      query: { page, limit, isDownload },
    } = req;

    const options: IOptions = {
      page: floor(toNumber(page)),
      limit: floor(toNumber(limit)),
      isDownload: isEqual(isDownload, 'true'),
    };

    const projectId = get(req, 'query.projectId', '');

    const type = get(req, 'query.type', '');

    const uploads = await getAllUploads(options, { ProjectId: projectId, deletedAt: null, type });

    res.json(
      transformResponseUtils({
        result: {
          ...uploads,
        },
      }),
    );
  } catch (error) {
    next(transformErrorUtils(error));
  }
};

export { createUpload, deleteById, readAllUploads };
