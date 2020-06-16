import {
  ValidationError,
  string,
  number,
  boolean,
  date,
  mixed,
  object,
  MixedSchema,
} from 'yup';
import { Op } from 'sequelize';
import { IMiddleware } from 'graphql-middleware';
import { anyNonNil } from 'is-uuid';
import { fromGlobalId } from 'graphql-relay';
import {
  isAfter,
  isBefore,
  setHours,
  setSeconds,
  setMinutes,
  setMilliseconds,
} from 'date-fns';

import { GraphQLContext } from '../../context';
import {
  GQLMutationCreateDeliveryArgs,
  GQLQueryDeliveriesArgs,
  GQLMutationUpdateDeliveryArgs,
  GQLMutationDeleteDeliveryArgs,
  GQLMutationPickupDeliveryArgs,
  GQLMutationCloseDeliveryArgs,
} from '../../generated/schema';
import { FileUploadPromise } from '../scalars/scalarHelper';

import createError = require('http-errors');

const createDelivery: IMiddleware<
  {},
  GraphQLContext,
  GQLMutationCreateDeliveryArgs
> = async (resolver, parent, args, ctx, info) => {
  try {
    const schema = object({
      input: object({
        clientMutationId: string(),
        product: string().required(),
        recipientId: string()
          .required()
          .transform(function transforId(val) {
            if (!this.isType(val)) {
              return val;
            }
            if (anyNonNil(val)) {
              return val;
            }
            const { type, id } = fromGlobalId(val);
            return type === 'Recipient' ? id : null;
          })
          .test('valid uuid', 'should be a valid uui', anyNonNil)
          .test(
            'valid recipient',
            'should be a valid recipient',
            async function recipientExists(val) {
              const recipient = await ctx.models.Recipient.findByPk(val, {
                attributes: ['id'],
                raw: true,
              });
              return !!recipient;
            },
          ),
        deliveryManId: string()
          .required()
          .transform(function transforId(val) {
            if (!this.isType(val)) {
              return val;
            }
            if (anyNonNil(val)) {
              return val;
            }
            const { type, id } = fromGlobalId(val);
            return type === 'DeliveryMan' ? id : null;
          })
          .test('valid uuid', 'should be a valid uui', anyNonNil)
          .test(
            'valid delivery man',
            'should be a valid delivery man',
            async function recipientExists(val) {
              const recipient = await ctx.models.DeliveryMan.findByPk(val, {
                attributes: ['id'],
                raw: true,
              });
              return !!recipient;
            },
          ),
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

export const deliveries: IMiddleware<
  {},
  GraphQLContext,
  GQLQueryDeliveriesArgs
> = async (resolver, parent, args, ctx, info) => {
  try {
    const schema = object({
      first: number()
        .positive()
        .nullable(),
      last: number()
        .positive()
        .nullable(),
      after: string()
        .transform(function transformGlobalCursor(val) {
          if (!val) {
            return val;
          }
          if (!this.isType(val)) {
            return val;
          }
          const { type, id } = fromGlobalId(val);
          return type === 'DeliveryEdgeCursor'
            ? id
            : { invalidCursorType: type, expected: 'DeliveryEdgeCursor' };
        })
        .test(
          'valid delivery edge cursor',
          'invalid cursor',
          function isValidDeliveryEdgeCursor(val) {
            if (!val) {
              return true;
            }
            const [createdAtStr, id] = val.split(':');
            const createdAtInt = Number.parseInt(createdAtStr, 10);
            return (
              anyNonNil(id) && !Number.isNaN(createdAtStr) && createdAtInt > 0
            );
          },
        )
        .nullable(),
      before: string()
        .transform(function transformGlobalCursor(val) {
          if (!this.isType(val)) {
            return val;
          }
          const { type, id } = fromGlobalId(val);
          return type === 'DeliveryEdgeCursor'
            ? id
            : { invalidCursorType: type, expected: 'DeliveryEdgeCursor' };
        })
        .test(
          'valid delivery edge cursor',
          'invalid cursor',
          function isValidDeliveryEdgeCursor(val) {
            if (!val) {
              return true;
            }
            const [createdAtStr, id] = val.split(':');
            const createdAtInt = Number.parseInt(createdAtStr, 10);
            return (
              anyNonNil(id) && !Number.isNaN(createdAtStr) && createdAtInt > 0
            );
          },
        )
        .nullable(),
      filter: object({
        canceled: boolean().default(false),
        delivered: boolean().default(false),
        withProblemsOnly: boolean().default(false),
        query: string(),
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

const updateDelivery: IMiddleware<
  {},
  GraphQLContext,
  GQLMutationUpdateDeliveryArgs
> = async (resolver, parent, args, ctx, info) => {
  try {
    const schema = object({
      input: object({
        clientMutationId: string(),
        deliveryId: string()
          .required()
          .transform(function transformDeliveryId(val) {
            if (!this.isType(val)) {
              return val;
            }
            const { type, id } = fromGlobalId(val);
            return type === 'Delivery'
              ? id
              : { invalidType: type, expected: 'Delivery' };
          }),
        values: object({
          recipient_id: string().transform(function transformRecipientId(val) {
            if (!this.isType(val)) {
              return val;
            }
            const { type, id } = fromGlobalId(val);
            return type === 'Recipient'
              ? id
              : { invalidType: type, expected: 'Recipient' };
          }),
          delivery_man_id: string().transform(function transformDeliveryManId(
            val,
          ) {
            if (!this.isType(val)) {
              return val;
            }
            const { type, id } = fromGlobalId(val);
            return type === 'DeliveryMan'
              ? id
              : { invalidType: type, expected: 'DeliveryMan' };
          }),
          signature_id: string()
            .transform(function transformSignatureId(val) {
              if (!this.isType(val)) {
                return val;
              }
              const { type, id } = fromGlobalId(val);
              return type === 'Avatar'
                ? id
                : { invalidType: type, expected: 'Avatar' };
            })
            .nullable(),
          product: string(),
          canceled_at: date().nullable(),
          start_date: date()
            .test(
              'valid time',
              'must be between 8h00 and 18h00',
              function testStartDate(val) {
                if (!val) {
                  return true;
                }
                const start = setMilliseconds(
                  setSeconds(setMinutes(setHours(val, 8), 0), 0),
                  0,
                );
                const end = setMilliseconds(
                  setSeconds(setMinutes(setHours(val, 18), 0), 0),
                  0,
                );
                return isAfter(val, start) && isBefore(val, end);
              },
            )
            .nullable(),
          end_date: date().nullable(),
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

const deleteDelivery: IMiddleware<
  {},
  GraphQLContext,
  GQLMutationDeleteDeliveryArgs
> = async (resolver, parent, args, ctx, info) => {
  try {
    const schema = object({
      input: object({
        clientMutationId: string(),
        deliveryId: string()
          .required()
          .transform(function transformDeliveryId(val) {
            if (!this.isType(val)) {
              return val;
            }
            const { type, id } = fromGlobalId(val);
            return type === 'Delivery'
              ? id
              : { invalidType: type, expected: 'Delivery' };
          }),
      }),
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

const pickupDelivery: IMiddleware<
  {},
  GraphQLContext,
  GQLMutationPickupDeliveryArgs
> = async (resolver, parent, args, ctx, info) => {
  try {
    const schema = object({
      input: object({
        clientMutationId: string(),
        deliveryId: string()
          .transform(function transformDeliveryId(val) {
            if (!this.isType(val)) {
              return val;
            }
            const { type, id } = fromGlobalId(val);
            return type === 'Delivery'
              ? id
              : { invalidType: type, expected: 'Delivery' };
          })
          .required()
          .test(
            'valid delivery',
            'must be a delivery for the delivery man',
            async function testDeliveryManDelivery(val) {
              const { deliveryManId } = this.parent;
              const delivery = await ctx.models.Delivery.findOne({
                where: {
                  delivery_man_id: deliveryManId,
                  id: val,
                },
              });
              return !!delivery;
            },
          ),
        deliveryManId: string()
          .transform(function transformDeliveryId(val) {
            if (!this.isType(val)) {
              return val;
            }
            const { type, id } = fromGlobalId(val);
            return type === 'DeliveryMan'
              ? id
              : { invalidType: type, expected: 'DeliveryMan' };
          })
          .test(
            'delivery limit',
            'reached delivery limit',
            async function testDeliveryLimit(val) {
              if (!val) {
                return true;
              }
              const { start_date }: { start_date: Date } = this.parent;
              const start = setMilliseconds(
                setSeconds(setMinutes(setHours(start_date, 8), 0), 0),
                0,
              );
              const end = setMilliseconds(
                setSeconds(setMinutes(setHours(start_date, 18), 0), 0),
                0,
              );
              const todayDeliveries = await ctx.models.Delivery.count({
                where: {
                  delivery_man_id: val,
                  start_date: {
                    [Op.gt]: start,
                    [Op.lt]: end,
                  },
                },
              });
              return todayDeliveries <= 5;
            },
          )
          .required(),
        start_date: date().test(
          'valid time',
          'must be between 8h00 and 18h00',
          function testStartDate(val) {
            if (!val) {
              return true;
            }
            const start = setMilliseconds(
              setSeconds(setMinutes(setHours(val, 8), 0), 0),
              0,
            );
            const end = setMilliseconds(
              setSeconds(setMinutes(setHours(val, 18), 0), 0),
              0,
            );
            return isAfter(val, start) && isBefore(val, end);
          },
        ),
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

const closeDelivery: IMiddleware<
  {},
  GraphQLContext,
  GQLMutationCloseDeliveryArgs
> = async (resolver, parent, args, ctx, info) => {
  try {
    const schema = object({
      input: object({
        clientMutationId: string(),
        deliveryId: string()
          .transform(function transformDeliveryId(val) {
            if (!this.isType(val)) {
              return val;
            }
            const { type, id } = fromGlobalId(val);
            return type === 'Delivery'
              ? id
              : { invalidType: type, expected: 'Delivery' };
          })
          .required()
          .test(
            'valid delivery',
            'must be a delivery for the delivery man',
            async function testDeliveryManDelivery(val) {
              const { deliveryManId } = this.parent;
              const delivery = await ctx.models.Delivery.findOne({
                where: {
                  delivery_man_id: deliveryManId,
                  id: val,
                },
              });
              return !!delivery;
            },
          ),
        deliveryManId: string()
          .transform(function transformDeliveryId(val) {
            if (!this.isType(val)) {
              return val;
            }
            const { type, id } = fromGlobalId(val);
            return type === 'DeliveryMan'
              ? id
              : { invalidType: type, expected: 'Delivery' };
          })
          .required(),
        end_date: date().required(),
        signature: mixed() as MixedSchema<FileUploadPromise>,
      }),
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

const validators = {
  Mutation: {
    createDelivery,
    updateDelivery,
    deleteDelivery,
    pickupDelivery,
    closeDelivery,
  },
  Query: {
    deliveries,
  },
};

export default validators;
