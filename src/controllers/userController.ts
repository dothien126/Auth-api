import { Request, Response } from 'express';

import {
  CreateUseInput,
  VerifyUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '../schemas/userSchema';
import { createUser, findUserById, findUserByEmail } from '../services/userService';
import sendEmail from '../utils/mailer';
import log from '../utils/logger';

export async function createUserHandler(req: Request<{}, {}, CreateUseInput>, res: Response) {
  const body = req.body;

  try {
    const user = await createUser(body);

    await sendEmail({
      from: 'test@gmail.com',
      to: `'dothien2601ak39@gmail.com', ${user.email}`,
      subject: 'Please verify your account',
      text: `verification code: ${user.verificationCode}. Id: ${user._id}`,
    });

    return res.status(200).json('User successfully created.');
  } catch (e: any) {
    if (e.code == 11000) {
      return res.status(409).json('Account is already exist');
    }
    return res.status(500).json(e);
  }
}

export const verifyUserHandler = async (req: Request<VerifyUserInput>, res: Response) => {
  try {
    const id = req.params.id;
    const verificationCode = req.params.verificationCode;

    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json('User is not exist');
    }

    if (user.verified) {
      return res.status(200).json('User is already verified');
    }

    if (user.verificationCode === verificationCode) {
      user.verified = true;

      await user.save();

      return res.status(200).json('User successfully verified');
    }

    return res.send('Could not verify user');
  } catch (e: any) {
    return res.status(500).json(e);
  }
};

export const forgotPasswordHandler = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) => {
  try {
    const message = 'You will receive a password reset email in your email';

    const { email } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      log.debug(`User with email ${email} does not exist`);
      return res.status(404).json('User is not exist');
    }

    if (!user.verified) {
      return res.status(400).json('User is not verified');
    }

    const passwordResetCode = '19991';
    user.passwordResetCode = passwordResetCode;

    await user.save();

    await sendEmail({
      from: 'test@gmail.com',
      to: `'dothien2601ak39@gmail.com', ${user.email}`,
      subject: 'Reset your password',
      text: `Password reset code: ${user.passwordResetCode}. Id: ${user._id}`,
    });

    return res.status(200).json(message);
  } catch (e: any) {
    return res.status(500).json(e);
  }
};

export const resetPasswordHandler = async (
  req: Request<ResetPasswordInput['params'], {}, ResetPasswordInput['body']>,
  res: Response
) => {
  try {
    const { id, passwordResetCode } = req.params;
    const { password } = req.body;
    const user = await findUserById(id);

    if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
      return res.status(400).json('Could not reset your password');
    }

    user.passwordResetCode = null;

    user.password = password;

    await user.save();

    return res.status(200).json('Successfully updated password');
  } catch (e: any) {
    return res.status(500).json(e);
  }
};

export async function getCurrentUserHandler(req: Request, res: Response) {
  return res.send(res.locals.user);
}
