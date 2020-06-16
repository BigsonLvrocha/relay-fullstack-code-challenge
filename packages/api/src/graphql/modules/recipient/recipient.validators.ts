import { object, string, number, StringSchema, ValidationError } from 'yup';
import { IMiddleware } from 'graphql-middleware';
import { fromGlobalId } from 'graphql-relay';
import { anyNonNil } from 'is-uuid';
import {
  GQLMutationCreateRecipientArgs,
  GQLMutationUpdateRecipientArgs,
  GQLBrState,
  GQLQueryRecipientsArgs,
} from '../../generated/schema';
import { GraphQLContext } from '../../context';

const cepTest = /^[0-9]{8}$/;

const recipients: IMiddleware<
  {},
  GraphQLContext,
  GQLQueryRecipientsArgs
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
        return type === 'RecipientEdgeCursor'
          ? id
          : { invalidCursorType: type, expected: 'RecipientEdgeCursor' };
      }),
      before: string().transform(function transformGlobalCursor(val) {
        if (!this.isType(val)) {
          return val;
        }
        const { type, id } = fromGlobalId(val);
        return type === 'RecipientEdgeCursor'
          ? id
          : { invalidCursorType: type, expected: 'RecipientEdgeCursor' };
      }),
      filter: object({
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
      return {
        Error: error.errors,
      };
    }
    throw error;
  }
};

const createRecipient: IMiddleware<
  {},
  GraphQLContext,
  GQLMutationCreateRecipientArgs
> = async (resolver, parent, args, ctx, info) => {
  try {
    const schema = object({
      input: object({
        clientMutationId: string(),
        values: object().shape({
          name: string()
            .min(2)
            .required(),
          street: string()
            .min(2)
            .required(),
          number: number()
            .integer()
            .positive()
            .nullable(),
          complement: string().nullable(),
          state: string().required() as StringSchema<GQLBrState>,
          city: string().required(),
          cep: string()
            .required()
            .test('cep text', 'cep must be valid', function testCep(val) {
              if (!val) {
                return true;
              }
              return cepTest.test(val);
            }),
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

const updateRecipient: IMiddleware<
  {},
  GraphQLContext,
  GQLMutationUpdateRecipientArgs
> = async (resolver, parent, args, ctx, info) => {
  try {
    const schema = object({
      input: object({
        clientMutationId: string(),
        id: string()
          .transform(function transformIdRelay(val) {
            if (!this.isType(val)) {
              return val;
            }
            if (anyNonNil(val)) {
              return val;
            }
            const { type, id } = fromGlobalId(val);
            if (type !== 'Recipient') {
              return null;
            }
            return id;
          })
          .test('is-uuid', 'should be valid id', anyNonNil)
          .required(),
        values: object().shape({
          name: string().min(2),
          street: string().min(2),
          number: number()
            .integer()
            .positive()
            .nullable(),
          complement: string().nullable(),
          state: string() as StringSchema<GQLBrState>,
          city: string(),
          cep: string().test('cep text', 'cep must be valid', function testCep(
            val,
          ) {
            if (!val) {
              return true;
            }
            return cepTest.test(val);
          }),
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

export default {
  Mutation: {
    updateRecipient,
    createRecipient,
  },
  Query: {
    recipients,
  },
};
