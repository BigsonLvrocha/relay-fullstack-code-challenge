import { promisify } from 'util';

import { verify, Secret, VerifyOptions } from 'jsonwebtoken';
import { Middleware } from 'koa';

import { models } from '../db';

const verifyAsync = promisify<
  string,
  Secret,
  VerifyOptions | undefined,
  object | string
>(verify);

export const authMiddleware: Middleware = async (ctx, next) => {
  const auth = ctx.request.headers.authorization;
  if (!auth) {
    return next();
  }
  const [bearer, token] = auth.split(' ');
  if (bearer !== 'Bearer') {
    throw new Error('invalid token');
  }
  const tokenData = (await verifyAsync(
    token,
    process.env.API_SECRET as string,
    undefined,
  )) as { userId?: string };
  const { userId } = tokenData;
  if (!userId) {
    throw new Error('invalid token');
  }
  const user = await models.User.findByPk(userId);
  if (!user) {
    throw new Error('invalid token');
  }
  ctx.state.user = user;
  return next();
};
