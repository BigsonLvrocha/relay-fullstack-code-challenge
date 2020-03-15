import { toGlobalId } from 'graphql-relay';
import { GQLResolvers } from '../../generated/schema';
import { idResolver } from '../helper/relayResolver';
import { Delivery } from '../../../db/models/Delivery';

import { model2cursor, loadAll } from './delivery.loader';

const resolvers: GQLResolvers = {
  Delivery: {
    _id: ({ id }) => id,
    id: idResolver<Delivery>('id', 'Delivery'),
    deliveryManId: idResolver<Delivery>('delivery_man_id', 'DeliveryMan'),
    recipientId: idResolver<Delivery>('recipient_id', 'Recipient'),
    signatureId: ({ signature_id }) =>
      signature_id ? toGlobalId('Avatar', signature_id) : null,
    deliveryMan: ({ delivery_man_id }, _args, ctx) =>
      ctx.dataloaders.DeliveryMan.load(delivery_man_id),
    recipient: ({ recipient_id }, _args, ctx) =>
      ctx.dataloaders.Recipient.load(recipient_id),
    signature: ({ signature_id }, _args, ctx) =>
      signature_id ? ctx.dataloaders.Avatar.load(signature_id) : null,
  },
  DeliveryEdge: {
    node: ({ node }, _args, ctx) =>
      node ? ctx.dataloaders.Delivery.load(node.id) : null,
  },
  Mutation: {
    async createDelivery(_parent, args, ctx) {
      const { deliveryManId, product, recipientId } = args.input;
      const delivery = await ctx.models.Delivery.create({
        delivery_man_id: deliveryManId,
        product,
        recipient_id: recipientId,
      });
      return {
        edge: {
          cursor: model2cursor(delivery),
          node: delivery,
        },
      };
    },
  },
  Query: {
    deliveries: (_parent, args, ctx) =>
      loadAll(ctx, {
        ...args,
        filter: {
          ...args.filter!,
          canceled: args.filter!.canceled!,
          delivered: args.filter!.delivered!,
        }!,
      }),
  },
};

export default resolvers;
