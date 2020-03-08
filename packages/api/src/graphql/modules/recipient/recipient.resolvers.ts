import { fromGlobalId, toGlobalId } from 'graphql-relay';
import { GQLResolvers } from '../../generated/schema';

const resolvers: GQLResolvers = {
  Mutation: {
    async createRecipient(_parent, args, ctx) {
      const { values, clientMutationId } = args.input;
      const recipient = await ctx.models.Recipient.create(values);
      return {
        recipient,
        clientMutationId,
      };
    },
    async updateRecipient(_parent, args, ctx) {
      const { values, clientMutationId, id: globalId } = args.input;
      const { id } = fromGlobalId(globalId);
      const recipient = await ctx.models.Recipient.findByPk(id);
      if (!recipient) {
        return {
          clientMutationId,
          Error: ['recipient not found'],
        };
      }
      await recipient.update(values);
      return {
        clientMutationId,
        recipient,
      };
    },
  },
  Recipient: {
    _id({ id }) {
      return id;
    },
    id({ id }) {
      return toGlobalId('Recipient', id);
    },
  },
};

export default resolvers;
