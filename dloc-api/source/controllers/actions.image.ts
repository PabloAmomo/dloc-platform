import { checkToken } from '../functions/checkToken';
import { createImageName } from '../functions/createImageName';
import { deleteImage } from '../services/device/deleteImage';
import { encriptionHelper } from '../functions/encriptionHelper';
import { getImage } from '../services/device/getImage';
import { getPersistence } from '../persistence/persistence';
import { getTokenAndAuthFromReq } from '../functions/getTokenAndAuthFromReq';
import { Request, Response } from 'express';
import { ResponseCode } from '../enums/ResponseCode';
import { uploadImage } from '../services/device/uploadImage';
import { UserData } from '../models/UserData';
import dotenv from 'dotenv';
import path from 'path';

const TEST_IMEI = '12345678901TEST';

export enum ImageActionsType {
  UPLOAD = 'UPLOAD',
  DOWNLOAD = 'DOWNLOAD',
  GET = 'GET',
  DELETE = 'DELETE',
}

/** Load environment variables */
dotenv.config();

/** Upload folder */
const UPLOAD_FOLDER: any = process.env.UPLOAD_FOLDER ?? 'uploads';

/** Image actions */
const imageActions: ImageActionsProps = async (type, req, res) => {
  const imei: string = req.params?.id ?? '';

  /** Upload folder */
  const uploadPath = path.join(`${process.cwd()}/`, `${UPLOAD_FOLDER}/`);

  if (!imei && type === ImageActionsType.GET) {
    getImage('no-image', uploadPath, type === ImageActionsType.GET ? false : true, req, res);
    return;
  }

  /** validate user for upload */
  const userData: UserData = await checkToken({ ...getTokenAndAuthFromReq(req), persistence: getPersistence(), encription: encriptionHelper });
  if (!userData.userId && type === ImageActionsType.UPLOAD && imei !== TEST_IMEI) {
    res.status(ResponseCode.UNAUTHORIZED).json({ error: 'Unauthorized' });
    return;
  }

  /** validate imei and upload */
  if (!imei) res.status(ResponseCode.BAD_REQUEST).json({ error: 'imei is required' });
  else {
    const name = createImageName(imei);
    if (type === ImageActionsType.UPLOAD) {
      uploadImage(name, uploadPath, req, res);
    } else if (type === ImageActionsType.GET || type === ImageActionsType.DOWNLOAD) {
      getImage(name, uploadPath, type === ImageActionsType.GET ? false : true, req, res);
    } else if (type === ImageActionsType.DELETE) {
      deleteImage(name, uploadPath).then((response: boolean) => {
        if (response) res.status(ResponseCode.OK).json({ data: { delete: true } });
        else res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({ error: 'Error deleting image' });
      });
    }
  }
};

export { imageActions };

interface ImageActionsProps {
  (type: ImageActionsType, req: Request, res: Response): void;
}
