import { NextFunction, Request, Response } from 'express';
import { get, isEqual, map, toLower } from 'lodash';
import multer, { FileFilterCallback, Multer, MulterError } from 'multer';
import path from 'path';
import { appConfiguration } from '../config';

type StorageConfig = {
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => void;
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => void;
};

const {
  file: { allowedExtensions },
} = appConfiguration;

const uploadDirectoryPath: string = path.normalize(`${__dirname}/../uploads/`);

const storageConfig: StorageConfig = {
  destination: (_, __, cb) => {
    cb(null, uploadDirectoryPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();

    const name = `${timestamp}_${get(file, 'originalname')}`;

    cb(null, name);
  },
};

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const fileExtension = toLower(path.extname(get(file, 'originalname')).substr(1));

  if (!allowedExtensions.includes(fileExtension)) {
    return cb(new Error(`Unsupported file format. Supported formats are: ${allowedExtensions.join(', ')}`));
  }

  cb(null, true);
};

const multerInstance: Multer = multer({ storage: multer.diskStorage(storageConfig), fileFilter });

const uploadType = {
  single: multerInstance.single('file'),
  multiple: multerInstance.array('files', 10),
};

const uploadFile = (type: keyof typeof uploadType) => {
  return (req: Request, res: Response) => {
    return new Promise<void>((resolve, reject) => {
      uploadType[type](req, res, (err: MulterError | Error | string) => {
        if (err) {
          reject(new Error(`${get(err, 'message', 'Unknown error')}`));
        } else {
          const files = get(req, 'files', []) as Express.Multer.File[];

          const filePath = isEqual(type, 'multiple') ? map(files, 'path') : get(req, 'file.path', '');

          const fileName = isEqual(type, 'multiple') ? map(files, 'filename') : get(req, 'file.filename', '');

          req.filePath = filePath;

          req.fileName = fileName;

          resolve();
        }
      });
    });
  };
};

const handleFileUpload = (type: keyof typeof uploadType = 'single') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await uploadFile(type)(req, res);

      next();
    } catch (err) {
      next(err);
    }
  };
};

export { handleFileUpload };
