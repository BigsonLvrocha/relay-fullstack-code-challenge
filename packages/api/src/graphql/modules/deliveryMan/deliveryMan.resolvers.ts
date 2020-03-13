import { toGlobalId } from 'graphql-relay';
import { GQLResolvers } from '../../generated/schema';

const resolvers: GQLResolvers = {
  Mutation: {
    async createDeliveryMan(_parent, args, ctx) {
      const { values } = args.input;
      const deliveryMan = await ctx.models.DeliveryMan.create({
        name: values.email,
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
  },
};

export default resolvers;
