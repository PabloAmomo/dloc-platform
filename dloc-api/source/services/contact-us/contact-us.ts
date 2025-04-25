import { sendEmail } from '../../functions/sendEmail';

const contactUs = async (email: string, subject: string, text: string) => {
  await sendEmail(email, subject, text);
};

export { contactUs };
