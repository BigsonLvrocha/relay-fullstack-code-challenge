import fs from 'fs';

import { ParameterizedContext } from 'koa';

import { models, sequelize } from '../db';
import { User } from '../db/models/User';

import { getLoaders } from './dataloaders';

export function getContext(ctx: ParameterizedContext) {
  return {
    models,
    user: ctx.state.user as User | undefined,
    dataloaders: getLoaders(models),
    sequelize,
    fs: {
      createWriteStream: fs.createWriteStream,
    },
  };
}

export type GraphQLContext = ReturnType<typeof getContext>;
