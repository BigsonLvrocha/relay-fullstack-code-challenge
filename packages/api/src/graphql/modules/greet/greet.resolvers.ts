import { GQLResolvers } from '../../generated/schema';

const resolvers: GQLResolvers = {
  Query: {
    hello(_parent, _args, ctx) {
      if (ctx.user) {
        return `hello ${ctx.user.name}`;
      }
      return 'hello visitor';
    },
  },
};

export default resolvers;
