import isValidImei from './isValidImei';
import isValidName from './isValidName';
import isValidVerificationCode from './isValidVerificationCode';

const checkSharedDeviceValidData: checkSharedDeviceValidDataProps = (searchParams, setSearchParams) => {
  const imei = searchParams.get('imei') ?? '';
  const name = searchParams.get('name') ?? '';
  const code = searchParams.get('code') ?? '';
  let to = searchParams.get('to') ?? '';

  try {
    if (to.startsWith('b64:')) to = atob(to.slice(4));
  } catch (e) {}

  if (!imei) return undefined;

  let error = undefined;
  if (!isValidImei(imei)) error = 'imei';
  else if (!isValidName(name)) error = 'name';
  else if (!isValidVerificationCode(code)) error = 'code';
  else if (!to) error = 'to';

  if (!error) setSearchParams(searchParams);

  return { imei, name, code, to, error };
};

export default checkSharedDeviceValidData;

interface checkSharedDeviceValidDataProps {
  (searchParams: URLSearchParams, setSearchParams: (searchParams: URLSearchParams) => void): SharedDeviceData | undefined;
}
