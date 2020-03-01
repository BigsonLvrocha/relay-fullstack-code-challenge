import { GraphQLContext } from '../../context';

function hello(_parent: {}, _args: {}, ctx: GraphQLContext) {
  if (ctx.user) {
    return `hello ${ctx.user.name}`;
  }
  return 'hello visitor';
}

export default {
  Query: {
    hello,
  },
};
