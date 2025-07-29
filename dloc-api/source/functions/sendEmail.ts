import { google } from 'googleapis';
import { printMessage } from './printMessage';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const USE_GMAIL_CLIENT_ID = process.env.GMAIL_CLIENTE_ID;
const USE_GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENTE_SECRET;
const USE_GMAIL_FROM = process.env.GMAIL_FROM;
const USE_GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const USE_GMAIL_USER = process.env.GMAIL_USER;

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(USE_GMAIL_CLIENT_ID, USE_GMAIL_CLIENT_SECRET, 'https://developers.google.com/oauthplayground');
oauth2Client.setCredentials({ refresh_token: USE_GMAIL_REFRESH_TOKEN });

const sendEmail = async (to: string, subject: string, text?: string, html?: string) => {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: USE_GMAIL_USER,
        clientId: USE_GMAIL_CLIENT_ID,
        clientSecret: USE_GMAIL_CLIENT_SECRET,
        refreshToken: USE_GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    } as SMTPTransport.Options);

    const from = USE_GMAIL_FROM;
    const mailOptions = { from, to, subject, text, html };

    transporter.sendMail(mailOptions, (error: Error | null, info: SMTPTransport.SentMessageInfo) => {
      if (error) printMessage(`Email not sent to ${to}: ${JSON.stringify(error)} (info: ${JSON.stringify(info)})`);
    });
  } catch (error) {
    printMessage(`Error sendinf email to ${to}: ${JSON.stringify(error)}`);
  }
};

export { sendEmail };
