import { object, ValidationError, string, number } from 'yup';
import { IMiddleware } from 'graphql-middleware';
import { anyNonNil } from 'is-uuid';
import { fromGlobalId } from 'graphql-relay';

import {
  GQLMutationCreateDeliveryManArgs,
  GQLMutationUpdateDeliveryManArgs,
  GQLMutationDeleteDeliveryManArgs,
  GQLQueryDeliveryMansArgs,
} from '../../generated/schema';
import { GraphQLContext } from '../../context';
import { deliveries } from '../delivery/delivery.validators';

import createError = require('http-errors');

const createDeliveryMan: IMiddleware<
  {},
  GraphQLContext,
  GQLMutationCreateDeliveryManArgs
> = async (resolver, parent, args, ctx, info) => {
  try {
    const schema = object({
      input: object({
        clientMutationId: string(),
        values: object({
          name: string().required(),
          email: string()
            .email()
            .required(),
          avatarId: string()
            .transform(function transformAvatarId(value) {
              if (!this.isType(value)) {
                return value;
              }
              if (anyNonNil(value)) {
                return value;
              }
              const { type, id } = fromGlobalId(value);
              if (type !== 'Avatar') {
                return null;
              }
              return id;
            })
            .test(
              'avatar valid',
              'avatar should be valid',
              async function isAvatarValid(val) {
                if (!val) {
                  return true;
                }
                const avatar = await ctx.models.Avatar.findByPk(val);
                return !!avatar;
              },
            )
            .nullable(),
        }),
      }).required(),
    });
    const result = await schema.validate(args);
    return resolver(parent, result, ctx, info);
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        Error: error.errors,
      };
    }
    throw error;
  }
};

const updateDeliveryMan: IMiddleware<
  {},
  GraphQLContext,
  GQLMutationUpdateDeliveryManArgs
> = async (resolver, parent, args, ctx, info) => {
  try {
    const schema = object({
      input: object({
        clientMutationId: string(),
        id: string()
          .required()
          .transform(function testDeliveryManId(val) {
            if (!this.isType(val)) {
              return val;
            }
            if (anyNonNil(val)) {
              return val;
            }
            const { type, id } = fromGlobalId(val);
            return type === 'DeliveryMan' ? id : null;
          }),
        values: object({
          name: string(),
          email: string().email(),
          avatarId: string()
            .transform(function transformAvatarId(value) {
              if (!this.isType(value)) {
                return value;
              }
              if (anyNonNil(value)) {
                return value;
              }
              const { type, id } = fromGlobalId(value);
              if (type !== 'Avatar') {
                return null;
              }
              return id;
            })
            .test(
              'avatar valid',
              'avatar should be valid',
              async function isAvatarValid(val) {
                if (!val) {
                  return true;
                }
                const avatar = await ctx.models.Avatar.findByPk(val);
                return !!avatar;
              },
            )
            .nullable(),
        }),
      }).required(),
    });
    const result = await schema.validate(args);
    return resolver(parent, result, ctx, info);
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        Error: error.errors,
      };
    }
    throw error;
  }
};

const deleteDeliveryMan: IMiddleware<
  {},
  GraphQLContext,
  GQLMutationDeleteDeliveryManArgs
> = async (resolver, parent, args, ctx, info) => {
  try {
    const schema = object({
      input: object({
        clientMutationId: string(),
        id: string()
          .required()
          .transform(function testDeliveryManId(val) {
            if (!this.isType(val)) {
              return val;
            }
            if (anyNonNil(val)) {
              return val;
            }
            const { type, id } = fromGlobalId(val);
            return type === 'DeliveryMan' ? id : null;
          }),
      }).required(),
    });
    const result = await schema.validate(args);
    return resolver(parent, result, ctx, info);
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        Error: error.errors,
      };
    }
    throw error;
  }
};

const deliveryMans: IMiddleware<
  {},
  GraphQLContext,
  GQLQueryDeliveryMansArgs
> = async (resolver, parent, args, ctx, info) => {
  try {
    const schema = object({
      first: number().positive(),
      last: number().positive(),
      after: string().transform(function transformGlobalCursor(val) {
        if (!this.isType(val)) {
          return val;
        }
        const { type, id } = fromGlobalId(val);
        return type === 'DeliveryManEdgeCursor'
          ? id
          : { invalidCursorType: type, expected: 'DeliveryManEdgeCursor' };
      }),
      before: string().transform(function transformGlobalCursor(val) {
        if (!this.isType(val)) {
          return val;
        }
        const { type, id } = fromGlobalId(val);
        return type === 'DeliveryManEdgeCursor'
          ? id
          : { invalidCursorType: type, expected: 'DeliveryManEdgeCursor' };
      }),
    }).test(
      'valid connection args test',
      'invalid connection args',
      function testConnectionArgs(val) {
        return !(
          (val.first && val.last) ||
          (val.first && val.before) ||
          (val.last && val.after) ||
          (val.after && val.before)
        );
      },
    );
    const result = await schema.validate(args);
    return resolver(parent, result, ctx, info);
  } catch (error) {
    if (error instanceof ValidationError) {
      return createError('400', error);
    }
    throw error;
  }
};

const validators = {
  Mutation: {
    createDeliveryMan,
    updateDeliveryMan,
    deleteDeliveryMan,
  },
  Query: {
    deliveryMans,
  },
  DeliveryMan: {
    deliveries,
  },
};

export default validators;
