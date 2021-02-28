import { fromGlobalId } from 'graphql-relay';

import { GQLResolvers } from '../../generated/schema';
import { GraphQLContext } from '../../context';
import { Models } from '../../../db';

function isSupportedType(
  type: string,
  ctx: GraphQLContext,
): type is keyof Models {
  return type in ctx.models;
}

const resolvers: GQLResolvers = {
  Query: {
    async node(_parent, args, ctx) {
      const { type, id } = fromGlobalId(args.id);
      if (!isSupportedType(type, ctx)) {
        return null;
      }
      const node = await ctx.dataloaders[type].load(id);
      const response = {
        ...node,
        __typename: type,
      };
      return response as any;
    },
  },
  Node: {
    __resolveType: ({ __typename }: any) => __typename,
  },
};

export default resolvers;
