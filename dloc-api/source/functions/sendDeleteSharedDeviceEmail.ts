import { sendEmail } from "./sendEmail";

const sendDeleteSharedDeviceEmail = async (email: string, name: string) => {
  const subject = `MaiPet: ${name} ya no está compartido...`;
  const message = `El propietario de ${name} ha dejado de compartilo, por lo que lo hemos quitado de tu perfil.`;
  await sendEmail(email, subject, '',  message);
};

export { sendDeleteSharedDeviceEmail };