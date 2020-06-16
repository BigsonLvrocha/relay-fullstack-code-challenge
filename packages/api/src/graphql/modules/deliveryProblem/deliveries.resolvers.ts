import { idResolver } from '../helper/relayResolver';
import { GQLResolvers } from '../../generated/schema';
import { DeliveryProblem } from '../../../db/models/DeliveryProblem';

const resolvers: GQLResolvers = {
  DeliveryProblem: {
    _id: ({ id }) => id,
    id: idResolver<DeliveryProblem>('id', 'DeliveryProblem'),
    deliveryId: idResolver<DeliveryProblem>('delivery_id', 'Delivery'),
    delivery: ({ delivery_id }, _args, ctx) =>
      ctx.dataloaders.Delivery.load(delivery_id),
  },
  Mutation: {
    async createDeliveryProblem(_parent, args, ctx) {
      const deliveryProblem = await ctx.models.DeliveryProblem.create({
        description: args.input.description,
        delivery_id: args.input.delivery_id,
      });
      return {
        deliveryProblem,
      };
    },
  },
};

export default resolvers;
