import { object, ValidationError, string } from 'yup';
import { IMiddleware } from 'graphql-middleware';

import { anyNonNil } from 'is-uuid';
import { fromGlobalId } from 'graphql-relay';
import {
  GQLMutationCreateDeliveryManArgs,
  GQLMutationUpdateDeliveryManArgs,
  GQLMutationDeleteDeliveryManArgs,
} from '../../generated/schema';
import { GraphQLContext } from '../../context';

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
      return error;
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
      return error;
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
      return error;
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
};

export default validators;
