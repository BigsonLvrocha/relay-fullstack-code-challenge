import { promisify } from 'util';

import { compare } from 'bcrypt';
import { sign, Secret, SignOptions } from 'jsonwebtoken';

import { GraphQLContext } from '../../context';

const signAsync = promisify<
  string | Buffer | object,
  Secret,
  SignOptions,
  string
>(sign);

type loginInput = {
  email: string;
  password: string;
  clientMutationId?: string | null;
};

async function login(
  _parent: {},
  args: { input: loginInput },
  ctx: GraphQLContext,
) {
  const user = await ctx.models.User.findOne({
    where: {
      email: args.input.email,
    },
  });
  if (!user) {
    return {
      clientMutationId: args.input.clientMutationId,
      error: ['invalid email or password'],
    };
  }
  const valid = await compare(args.input.password, user.password_hash);
  if (!valid) {
    return {
      clientMutationId: args.input.clientMutationId,
      error: ['invalid email or password'],
    };
  }
  const token = await signAsync(
    { userId: user.id },
    process.env.API_SECRET as string,
    {
      expiresIn: '7d',
    },
  );
  return {
    clientMutationId: args.input.clientMutationId,
    token,
  };
}

export default {
  Mutation: {
    login,
  },
};
