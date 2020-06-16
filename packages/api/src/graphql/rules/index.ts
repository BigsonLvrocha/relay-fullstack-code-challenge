import { rule } from 'graphql-shield';

import { GraphQLContext } from '../context';

import createError = require('http-errors');

export const isAdmin = rule({ cache: 'contextual' })(
  (_parent, _arg, ctx: GraphQLContext) => {
    if (!ctx.user) {
      return createError(401, 'Not authorized');
    }
    return true;
  },
);
