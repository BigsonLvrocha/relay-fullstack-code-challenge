import { models } from '../db';

export function getContext() {
  return {
    models,
  };
}

export type GraphQLContext = ReturnType<typeof getContext>;
