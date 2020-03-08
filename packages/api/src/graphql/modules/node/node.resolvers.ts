import { fromGlobalId } from 'graphql-relay';

import { GQLResolvers } from '../../generated/schema';
import { GraphQLContext } from '../../context';
import { Models, AnyModel } from '../../../db';

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
      const model = ctx.models[type] as AnyModel;
      const node = await model.findByPk(id, {
        raw: true,
      });
      if (!node) {
        return null;
      }
      return {
        ...node,
        __typename: type,
      };
    },
  },
  node: {
    __resolveType: ({ __typename }: any) => __typename,
  },
};

export default resolvers;
