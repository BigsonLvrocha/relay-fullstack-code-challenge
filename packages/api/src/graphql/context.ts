import { ParameterizedContext } from 'koa';

import { models } from '../db';
import { User } from '../db/models/User';
import { getLoaders } from './dataloaders';

export function getContext(ctx: ParameterizedContext) {
  return {
    models,
    user: ctx.state.user as User | undefined,
    dataloaders: getLoaders(models),
  };
}

export type GraphQLContext = ReturnType<typeof getContext>;
