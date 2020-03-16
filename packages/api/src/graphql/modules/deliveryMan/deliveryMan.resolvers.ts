import { toGlobalId } from 'graphql-relay';
import { GQLResolvers } from '../../generated/schema';
import { loadAll as loadAllDeliveries } from '../delivery/delivery.loader';

import { model2cursor, loadAll } from './deliveryMan.loader';

const resolvers: GQLResolvers = {
  Mutation: {
    async createDeliveryMan(_parent, args, ctx) {
      const { values } = args.input;
      const deliveryMan = await ctx.models.DeliveryMan.create({
        name: values.name,
        email: values.email,
        avatar_id: values.avatarId,
      });
      return {
        deliveryMan,
      };
    },
    async updateDeliveryMan(_parent, args, ctx) {
      const { values, id } = args.input;
      const deliveryMan = await ctx.models.DeliveryMan.findByPk(id);
      if (!deliveryMan) {
        return {
          Error: ['Delivery man not found'],
        };
      }
      await deliveryMan.update({
        name: values.name,
        email: values.email,
        avatar_id: values.avatarId,
      });
      return {
        deliveryMan,
      };
    },
    async deleteDeliveryMan(_parent, args, ctx) {
      const { id } = args.input;
      const deliveryMan = await ctx.models.DeliveryMan.findByPk(id);
      if (!deliveryMan) {
        return {
          Error: ['Delivery man not found'],
        };
      }
      await deliveryMan.destroy();
      return {
        deletedDeliveryManId: toGlobalId('DeliveryMan', id),
      };
    },
  },
  DeliveryMan: {
    avatarId: ({ avatar_id }) =>
      avatar_id ? toGlobalId('Avatar', avatar_id) : null,
    avatar: ({ avatar_id }, _args, ctx) =>
      avatar_id ? ctx.dataloaders.Avatar.load(avatar_id) : null,
    id: ({ id }) => toGlobalId('DeliveryMan', id),
    _id: ({ id }) => id,
    deliveries: ({ id }, args, ctx) =>
      loadAllDeliveries(ctx, {
        ...args,
        filter: {
          canceled: args.filter!.canceled!,
          delivered: args.filter!.delivered!,
          delivery_man_id: id,
        },
      }),
  },
  DeliveryManEdge: {
    cursor(parent) {
      return model2cursor(parent);
    },
    node: (parent, _args, ctx) => ctx.dataloaders.DeliveryMan.load(parent.id),
  },
  Query: {
    deliveryMans: (_parent, args, ctx) => loadAll(ctx, args),
  },
};

export default resolvers;
