import { ParameterizedContext } from 'koa';

import { models } from '../db';
import { User } from '../db/models/User';

export function getContext(ctx: ParameterizedContext) {
  return {
    models,
    user: ctx.state.user as User | undefined,
  };
}

export type GraphQLContext = ReturnType<typeof getContext>;
