import { MutableRefObject } from 'react';
import { User } from 'models/User';
import dataURLToBlob from 'functions/dataURLToBlob';
import serviceCall from 'functions/serviceCall';
import { DeleteImageResult } from 'models/DeleteImageResult';

const path = 'devices';

const deleteImageService = (props: DeleteImageServiceProps): void => {
  const { user, imei, callback, abort } = props;

  serviceCall({
    type: 'DELETE',
    token: user.token,
    authProvider: user.authProvider,
    path: `/${path}/${imei}/image`,
    defValue: [],
    abort,
    onEnd: (response: any) => callback && callback({ delete: response?.data?.delete ?? false, error: response?.error }),
  });
};

export default deleteImageService;

interface DeleteImageServiceProps {
  user: User;
  imei: string;
  callback: { (response: DeleteImageResult): any };
  abort: MutableRefObject<AbortController | undefined>;
}
