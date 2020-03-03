import { toGlobalId } from 'graphql-relay';
import { GQLResolvers } from '../../generated/schema';

const resolvers: GQLResolvers = {
  User: {
    id({ id }) {
      return toGlobalId('User', id);
    },
    _id({ id }) {
      return id;
    },
  },
  Query: {
    me: (_parent, _args, ctx) => ctx.user!,
  },
};

export default resolvers;
