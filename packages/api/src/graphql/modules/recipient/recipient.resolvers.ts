import { toGlobalId } from 'graphql-relay';
import { GQLResolvers } from '../../generated/schema';
import { loadAll } from './recipient.loader';

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
      const { values, clientMutationId, id } = args.input;
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
  Query: {
    async recipients(_parent, args, ctx) {
      return loadAll(ctx, args);
    },
  },
  RecipientEdge: {
    node({ node }, _args, ctx) {
      return node ? ctx.dataloaders.Recipient.load(node.id) : null;
    },
  },
};

export default resolvers;
