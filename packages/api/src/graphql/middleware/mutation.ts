import { IMiddleware } from 'graphql-middleware';

export const Mutation: IMiddleware = async (
  resolver,
  parent,
  args,
  ctx,
  info,
) => {
  const response = await resolver(parent, args, ctx, info);
  return {
    ...response,
    clientMutationId: args.input?.clientMutationId,
  };
};

export const mutationMiddleware = {
  Mutation,
};
