import { toGlobalId } from 'graphql-relay';
import { resolve } from 'path';
import { createWriteStream } from 'fs';
import { v4 } from 'uuid';

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
    deliveryProblems: ({ id }, _args, ctx) =>
      ctx.models.DeliveryProblem.findAll({
        where: {
          delivery_id: id,
        },
        raw: true,
      }),
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
    async updateDelivery(_parent, args, ctx) {
      const { deliveryId, values } = args.input;
      const delivery = await ctx.models.Delivery.findByPk(deliveryId);
      if (!delivery) {
        return {
          Error: ['Delivery not found'],
        };
      }
      await delivery.update(values);
      return {
        delivery,
      };
    },
    async deleteDelivery(_parent, args, ctx) {
      const { deliveryId } = args.input;
      const delivery = await ctx.models.Delivery.findByPk(deliveryId);
      if (!delivery) {
        return {
          Error: ['Delivery not found'],
        };
      }
      await delivery.destroy();
      return {
        deletedDeliveryId: toGlobalId('Delivery', deliveryId),
      };
    },
    async pickupDelivery(_parent, args, ctx) {
      const { start_date, deliveryId } = args.input;
      const delivery = await ctx.models.Delivery.findByPk(deliveryId);
      if (!delivery) {
        return {
          Error: ['Delivery not found'],
        };
      }
      await delivery.update({
        start_date,
      });
      return {
        delivery,
      };
    },
    async closeDelivery(_parent, args, ctx) {
      const { end_date, deliveryId, signature } = args.input;
      const delivery = await ctx.models.Delivery.findByPk(deliveryId);
      if (!delivery) {
        return {
          Error: ['Delivery not found'],
        };
      }
      const fileData = await signature;
      const extension = fileData.filename.split('.').pop();
      const filename = `${v4()}.${extension}`;
      const path = resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'tmp',
        'uploads',
        filename,
      );
      const streamIn = fileData.createReadStream();
      const streamOut = createWriteStream(path);
      await new Promise((res, rej) => {
        streamIn
          .pipe(streamOut)
          .on('finish', res)
          .on('error', rej);
      });
      await ctx.sequelize.transaction(async t => {
        const avatar = await ctx.models.Avatar.create(
          {
            original_name: fileData.filename,
            path: filename,
          },
          {
            transaction: t,
          },
        );
        await delivery.update(
          {
            signature_id: avatar.id,
            end_date,
          },
          {
            transaction: t,
          },
        );
      });
      return {
        delivery,
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
          withProblemOnly: args.filter!.withProblemsOnly!,
        }!,
      }),
  },
};

export default resolvers;
