import { Op } from 'sequelize';
import { ConnectionArguments, toGlobalId } from 'graphql-relay';
import { GraphQLContext } from '../../context';
import { DeliveryMan } from '../../../db/models/DeliveryMan';

export function model2cursor(model: DeliveryMan) {
  return toGlobalId('DeliveryManEdgeCursor', model.email);
}

async function cursor2offset(ctx: GraphQLContext, cursor: string) {
  return ctx.models.DeliveryMan.count({
    where: {
      email: {
        [Op.lt]: cursor,
      },
    },
  });
}

export async function loadAll(ctx: GraphQLContext, args: ConnectionArguments) {
  const totalCount = await ctx.models.DeliveryMan.count();
  if (totalCount === 0) {
    return {
      totalCount,
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
  let offset = 0;
  let limit = 10;
  if (args.first) {
    limit = args.first;
    if (args.after) {
      offset = (await cursor2offset(ctx, args.after)) + 1;
    }
  } else if (args.last) {
    limit = args.last;
    if (args.before) {
      const offsetBefore = await cursor2offset(ctx, args.before);
      offset = offsetBefore - limit;
    } else {
      offset = totalCount - args.last;
    }
    if (offset < 0) {
      limit = -offset;
      offset = 0;
    }
  }
  const edges = await ctx.models.DeliveryMan.findAll({
    limit,
    offset,
    raw: true,
    attributes: ['id', 'email'],
    order: [['email', 'ASC']],
  });
  if (edges.length === 0) {
    return {
      totalCount,
      edges: [],
      pageInfo: {
        hasNextPage: offset === 0,
        hasPreviousPage: offset + limit >= totalCount,
      },
    };
  }
  const startEdge = edges[0];
  const endEdge = edges[edges.length - 1];
  return {
    totalCount,
    edges,
    pageInfo: {
      hasPreviousPage: offset > 0,
      hasNextPage: offset + limit < totalCount,
      startCursor: model2cursor(startEdge),
      endCursor: model2cursor(endEdge),
    },
  };
}
