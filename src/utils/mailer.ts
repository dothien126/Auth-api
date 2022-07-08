import nodemailer, { SendMailOptions } from 'nodemailer';
import config from 'config';

import log from './logger';

// const createTransport = async () => {
//   const transport = await nodemailer.createTestAccount();
//   console.log({ transport });
// };
// createTransport();

const smtp = config.get<{
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
}>('smtp');

const transporter = nodemailer.createTransport({
  ...smtp,
  auth: {
    user: smtp.user,
    pass: smtp.pass,
  },
});

const sendEmail = async (payload: SendMailOptions) => {
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      log.error(err, 'Error sending mail');
      return;
    }

    log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
};

export default sendEmail;
