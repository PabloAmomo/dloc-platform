import { printMessage } from '../../functions/printMessage';
import fs from 'fs';

/** Delete an image */
const deleteImage = async (name: string, uploadPath: string): Promise<boolean> => {
  let file = `${uploadPath}${name}.png`;

  try {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  } catch (error: any) {
    printMessage(`Error deleting image ${name}.png: ${error?.message ?? error}`);
    return false;
  }

  return true;
};

export { deleteImage };
