import { IMiddleware } from 'graphql-middleware';
import { ValidationError, object, string } from 'yup';

import { fromGlobalId } from 'graphql-relay';
import { GQLMutationCreateDeliveryProblemArgs } from '../../generated/schema';
import { GraphQLContext } from '../../context';

const createDeliveryProblem: IMiddleware<
  {},
  GraphQLContext,
  GQLMutationCreateDeliveryProblemArgs
> = async (resolver, parent, args, ctx, info) => {
  try {
    const schema = object({
      input: object({
        clientMutationId: string(),
        delivery_id: string()
          .required()
          .transform(function transformDeliveryId(val) {
            if (!this.isType(val)) {
              return val;
            }
            const { type, id } = fromGlobalId(val);
            return type === 'Delivery'
              ? id
              : { invalidType: type, expected: 'Delivery' };
          })
          .test(
            'valid delivery',
            'delivery not found',
            async function checkDeliveryInDb(val) {
              if (!val) {
                return true;
              }
              const delivery = await ctx.models.Delivery.findByPk(val);
              return !!delivery;
            },
          ),
        description: string().required(),
      }),
    });
    const result = await schema.validate(args);
    return resolver(parent, result, ctx, info);
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        Error: error,
      };
    }
    throw error;
  }
};

export default {
  Mutation: {
    createDeliveryProblem,
  },
};
