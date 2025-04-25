import { AuthProviders } from 'enums/AuthProviders';
import { MutableRefObject } from 'react';
import { SendEmailResult } from 'models/sendEmailResult';
import serviceCall from 'functions/serviceCall';

const path = 'email';

function contactUs(props: contactUsProps): void {
  const { email, name, message, callback, abort } = props;

  serviceCall({
    type: 'POST',
    path: '/contact-us',
    params: { body: { name, email, message }},
    onEnd: (response: any) => callback && callback({ send: response?.data?.send ?? false, error: response?.error }),
    authProvider: AuthProviders.none,
    defValue: [],
    token: '',
    abort,
  });
}

export default contactUs;

interface contactUsProps {
  email: string;
  name: string;
  message: string;
  callback: { (response: SendEmailResult): any };
  abort: MutableRefObject<AbortController | undefined>;
}
