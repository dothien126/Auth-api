import { Request, Response } from 'express';

import { CreateSessionSchema } from '../schemas/authSchema';
import { findUserByEmail, findUserById } from '../services/userService';
import { findSessionById, signAccessToken, signRefreshToken } from '../services/authService';
import { get } from 'lodash';
import { verifyJwt } from '../utils/jwt';

export const createSessionHandler = async (
  req: Request<{}, {}, CreateSessionSchema>,
  res: Response
) => {
  const message = 'Invalid remail or password';
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(404).json('User is not exist');
  }

  if (!user.verified) {
    return res.status(400).json('Please verify your email');
  }

  const isValid = await user.validatePassword(password);
  if (!isValid) {
    return res.status(400).json(message);
  }

  // sign a access token
  const accessToken = signAccessToken(user);

  // sign a refresh token
  const refreshToken = await signRefreshToken({ userId: user._id });

  // send a tokens
  return res.status(201).send({accessToken, refreshToken});
};

export async function refreshAccessTokenHandler(req: Request, res: Response) {
    const refreshToken = get(req, "headers.x-refresh");
  
    const decoded = verifyJwt<{ session: string }>(
      refreshToken,
      "refreshTokenPublicKey"
    );
  
    if (!decoded) {
      return res.status(401).send("Could not refresh access token");
    }
  
    const session = await findSessionById(decoded.session);
  
    if (!session || !session.valid) {
      return res.status(401).send("Could not refresh access token");
    }
  
    const user = await findUserById(String(session.user));
  
    if (!user) {
      return res.status(401).send("Could not refresh access token");
    }
  
    const accessToken = signAccessToken(user);
  
    return res.send({ accessToken });
  }
