import { configDotenv } from 'dotenv';
import { contactUs } from '../services/contact-us/contact-us';
import { printMessage } from '../functions/printMessage';
import { ResponseCode } from '../enums/ResponseCode';
import express, { Request, Response } from 'express';
configDotenv();

const CONTACT_US_MAIL_TO = process.env.CONTACT_US_MAIL_TO ?? '';

const routers = express.Router();

routers.post('/contact-us', async (req: Request, res: Response, next) => {
  const { email, name, message } = req.body;

  if (!email || !name || !message) return res.status(ResponseCode.BAD_REQUEST).json({ message: 'Bad request' });

  if (!CONTACT_US_MAIL_TO) {
    printMessage('The contact email is not defined');
    return res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }

  await contactUs(CONTACT_US_MAIL_TO, `Contact from [${name}] (${email})`, `[${name}] (${email}) send the message: \n\n${message}`);
  return res.status(ResponseCode.OK).json({ send: true });
});

export default routers;
