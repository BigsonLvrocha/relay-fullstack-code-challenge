import Sequelize, { FindOptions } from 'sequelize';

import { ConnectionArguments, toGlobalId } from 'graphql-relay';
import { GraphQLContext } from '../../context';
import { Recipient } from '../../../db/models/Recipient';

const { Op } = Sequelize;

async function cursor2offset(
  ctx: GraphQLContext,
  cursor: string,
  findOption: FindOptions,
) {
  const offset = await ctx.models.Recipient.count({
    where: {
      [Op.and]: [
        {
          id: {
            [Op.lt]: cursor,
          },
        },
        findOption.where || {},
      ],
    },
  });
  return offset;
}

function model2cursor(model: Recipient) {
  return toGlobalId('RecipientEdgeCursor', model.id);
}

type LoadAllRecipientsArgs = ConnectionArguments & {
  filter?: {
    query?: string | null;
  } | null;
};

export async function loadAll(
  ctx: GraphQLContext,
  args: LoadAllRecipientsArgs,
) {
  const findOptions: FindOptions = {
    where: args.filter?.query
      ? {
          name: {
            [Op.iLike]: `%${args.filter.query}%`,
          },
        }
      : {},
  };
  const totalCount = await ctx.models.Recipient.count(findOptions);
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
  const edges = await ctx.models.Recipient.findAll({
    ...findOptions,
    limit,
    offset,
    raw: true,
    attributes: ['id'],
    order: [['id', 'ASC']],
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
