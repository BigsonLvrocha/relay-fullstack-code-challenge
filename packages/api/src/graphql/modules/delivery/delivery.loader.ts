import Sequelize, { FindOptions } from 'sequelize';
import { toGlobalId, ConnectionArguments } from 'graphql-relay';

import { GraphQLContext } from '../../context';
import { Delivery } from '../../../db/models/Delivery';

const { Op } = Sequelize;

async function cursor2offset(
  ctx: GraphQLContext,
  cursor: string,
  findOption: FindOptions,
) {
  const [createdAt, id] = cursor.split(':');
  const createdAtDate = new Date(Number.parseInt(createdAt, 10));
  const offset = await ctx.models.Delivery.count({
    where: {
      [Op.and]: [
        findOption.where || {},
        {
          [Op.or]: [
            {
              created_at: {
                [Op.gt]: createdAtDate,
              },
            },
            {
              created_at: {
                [Op.eq]: createdAtDate,
              },
              id: {
                [Op.lt]: id,
              },
            },
          ],
        },
      ],
    },
  });
  return offset;
}

export function model2cursor(model: Delivery) {
  const { created_at, id } = model;
  return toGlobalId('DeliveryEdgeCursor', `${created_at.getTime()}:${id}`);
}

type LoadAllDeliveryArgs = ConnectionArguments & {
  filter: {
    canceled: boolean;
    delivered: boolean;
    delivery_man_id?: string;
    withProblemOnly: boolean;
    query?: string | null;
  };
};

export async function loadAll(ctx: GraphQLContext, args: LoadAllDeliveryArgs) {
  const findOptions: FindOptions = {
    where: {
      [Op.and]: [
        {
          canceled_at: {
            [args.filter.canceled ? Op.ne : Op.eq]: null,
          },
          end_date: {
            [args.filter.delivered ? Op.ne : Op.eq]: null,
          },
        },
        args.filter.delivery_man_id
          ? {
              delivery_man_id: args.filter.delivery_man_id,
            }
          : {},
        args.filter.query
          ? {
              product: {
                [Op.iLike]: `%${args.filter.query}%`,
              },
            }
          : {},
      ],
    },
    ...(args.filter.withProblemOnly
      ? {
          include: [
            {
              model: ctx.models.DeliveryProblem,
              required: true,
              attributes: [],
            },
          ],
        }
      : {}),
  };
  const totalCount = await ctx.models.Delivery.count(findOptions);
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
      offset = (await cursor2offset(ctx, args.after, findOptions)) + 1;
    }
  } else if (args.last) {
    limit = args.last;
    if (args.before) {
      const offsetBefore = await cursor2offset(ctx, args.before, findOptions);
      offset = offsetBefore - limit;
    } else {
      offset = totalCount - args.last;
    }
    if (offset < 0) {
      limit = -offset;
      offset = 0;
    }
  }
  const edges = await ctx.models.Delivery.findAll({
    ...findOptions,
    limit,
    offset,
    raw: true,
    attributes: ['id', 'created_at'],
    order: [
      ['created_at', 'DESC'],
      ['id', 'ASC'],
    ],
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
    edges: edges.map((edge) => ({
      cursor: model2cursor(edge),
      node: edge,
    })),
    pageInfo: {
      hasPreviousPage: offset > 0,
      hasNextPage: offset + limit < totalCount,
      startCursor: model2cursor(startEdge),
      endCursor: model2cursor(endEdge),
    },
  };
}
