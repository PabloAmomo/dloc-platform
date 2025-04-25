import { MutableRefObject } from 'react';
import { User } from 'models/User';
import dataURLToBlob from 'functions/dataURLToBlob';
import serviceCall from 'functions/serviceCall';
import { UpdateImageResult } from 'models/UpdateImageResult';

const path = 'devices';

const updateImageService = (props: UpdateImageServiceProps): void => {
  const { user, imei, imageUrlData, callback, abort } = props;
  
  const formData: FormData = new FormData();
  formData.append('image', dataURLToBlob(imageUrlData), 'image.png');

  serviceCall({
    type: 'POST',
    token: user.token,
    authProvider: user.authProvider,
    path: `/${path}/${imei}/image`,
    defValue: [],
    formData,
    abort,
    onEnd: (response: any) => callback && callback({ update: response?.data?.update ?? false, error: response?.error }),
  });
};

export default updateImageService;

interface UpdateImageServiceProps {
  user: User;
  imei: string;
  imageUrlData: string;
  callback: { (response: UpdateImageResult): any };
  abort: MutableRefObject<AbortController | undefined>;
}
