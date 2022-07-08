import { DocumentType } from '@typegoose/typegoose';
import { omit } from 'lodash';
import SessionModel from '../models/sessionModel';

import { privateFields, User } from '../models/userModel';
import { signJwt } from '../utils/jwt';

export const signAccessToken = async (user: DocumentType<User>) => {
  const payload = omit(user.toJSON(), privateFields);

  const accessToken = signJwt(payload, 'accessTokenPrivateKey', {
    expiresIn: '15m',
  });

  return accessToken;
};

export async function findSessionById(id: string) {
  return SessionModel.findById(id);
}

export const createSession = async ({ userId }: { userId: string }) => {
  return SessionModel.create({ user: userId });
};

export const signRefreshToken = async ({ userId }: { userId: string }) => {
  const session = await createSession({ userId });

  const refreshToken = signJwt(
    {
      session: session._id,
    },
    'refreshTokenPrivateKey',
    {
      expiresIn: '1m',
    }
  );

  return refreshToken;
};
