import { Request, Response } from 'express';
import { ResponseCode } from '../../enums/ResponseCode';
import multer from 'multer';

/** Filter if the file is an image */
const fileFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Not an image! Please upload an image.'), false);
};

/** Upload an image */
const uploadImage = async (name: string, upladPath: string, req: Request, res: Response) => {
  const storage = multer.diskStorage({
    /** Destination folder */
    destination: (req: Request, file, cb) => cb(null, `${upladPath}/`),
    /** File name */
    filename: (req: Request, file, cb) => cb(null, `${name}.png`),
  });

  /** Upload Parameters */
  const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 },
    fileFilter: fileFilter,
  }).single('image');

  /** Upload */
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError || err) return res.status(ResponseCode.BAD_REQUEST).json({ error: err.message });
    /** File uploaded */
    res.status(ResponseCode.OK).json({ data: { update: true } });
  });
};

export { uploadImage };
