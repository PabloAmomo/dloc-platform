import { sendEmail } from "./sendEmail";

const sendAddSharedDeviceEmail = async (email: string, imei: string, name: string, code: string) => {
  const url = `${process.env.WEB_URL}/?imei=${imei}&name=${name}&code=${code}&to=${Buffer.from(email.toLowerCase().trim()).toString('base64')}`;
  const subject = `MaiPet: Se ha compartido a ${name} contigo...`;
  const message = `Han compartido contigo a ${name}.<br/><a href="${url}">Haz click aquí para incluirlo en tu perfile...</a>`;
  await sendEmail(email, subject, '',  message);
};

export { sendAddSharedDeviceEmail };