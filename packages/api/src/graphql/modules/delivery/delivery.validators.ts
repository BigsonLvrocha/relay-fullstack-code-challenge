import { ValidationError, object, string } from 'yup';
import { IMiddleware } from 'graphql-middleware';
import { anyNonNil } from 'is-uuid';
import { fromGlobalId } from 'graphql-relay';
import { GraphQLContext } from '../../context';
import { GQLMutationCreateDeliveryArgs } from '../../generated/schema';

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

const validators = {
  Mutation: {
    createDelivery,
  },
};

export default validators;
