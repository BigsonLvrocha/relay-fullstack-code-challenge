import { rule } from 'graphql-shield';

import { GraphQLContext } from '../context';

export const isAdmin = rule({ cache: 'contextual' })(
  (_parent, _arg, ctx: GraphQLContext) => {
    return !!ctx.user;
  },
);
