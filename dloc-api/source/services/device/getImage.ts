import { Request, Response } from 'express';
import { ResponseCode } from '../../enums/ResponseCode';
import fs from 'fs';

const getImage = async (name: string, uploadPath: string, download: boolean, req: Request, res: Response) => {
  let file = `${uploadPath}${name}.png`;

  const fileExist = fs.existsSync(file);
  if (!fileExist) file = `${uploadPath}no-image.png`;

  if (download) {
    res.download(file, (err) => {
      if (err) res.status(ResponseCode.NOT_FOUND).json({ error: err.message });
    });
    return;
  }

  fs.readFile(file, (err, data) => {
    if (err) res.status(ResponseCode.NOT_FOUND).json({ error: 'image not found' });
    else res.writeHead(ResponseCode.OK, { 'Content-Type': 'image/jpeg' }).end(data);
  });
};

export { getImage };
