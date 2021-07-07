import { jest } from '@jest/globals';

import { getLoaders } from '../../graphql/dataloaders';
import { models, sequelize } from '../../db';
import { User } from '../../db/models/User';

export function getTestContext(user?: User) {
  const createWriteStream = jest.fn(
    () =>
      ({
        pipe: jest.fn(function pipeMock(this: jest.Mock) {
          return this;
        }),
        on(event: string, fn: () => {}) {
          if (event === 'finish') {
            fn();
          }
          return this;
        },
      } as any),
  );
  return {
    models,
    sequelize,
    dataloaders: getLoaders(models),
    user,
    fs: {
      createWriteStream,
    },
  };
}

export type GraphQLTestContext = ReturnType<typeof getTestContext>;
