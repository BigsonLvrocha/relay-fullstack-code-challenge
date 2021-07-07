import { execute } from 'graphql';
import { hashSync } from 'bcrypt';
import { jest } from '@jest/globals';
import faker from 'faker';
import gql from 'graphql-tag';
import { toGlobalId } from 'graphql-relay';

import { models, sequelize } from '../../../../db';
import { User } from '../../../../db/models/User';
import {
  createTestSchema,
  getTestContext,
  GraphQLTestContext,
} from '../../../../__tests__/fixtures';

const uploadAvatarMutation = gql`
  mutation UploadAvatarMutation($input: UploadAvatarInput!) {
    uploadAvatar(input: $input) {
      clientMutationId
      avatar {
        id
        _id
        original_name
        path
        url
      }
      Error
    }
  }
`;

const schema = createTestSchema();

let user: User;
let contextValue: GraphQLTestContext;

beforeAll(async () => {
  user = await models.User.create({
    name: faker.name.firstName(),
    email: `e${faker.datatype.uuid()}@team.com.br`,
    password_hash: hashSync('1234', 10),
  });
  contextValue = getTestContext({ state: { user } } as any);
});

afterAll(async () => {
  await user.destroy();
  await sequelize.close();
});

it('creates a new avatar', async () => {
  const original_name = `${faker.datatype.uuid()}.png`;
  const clientMutationId = faker.datatype.uuid();
  const fileData = {
    createReadStream: jest.fn(() => ({
      pipe: jest.fn(function pipeMock(this: jest.Mock) {
        return this;
      }),
      on(event: string, fn: () => {}) {
        if (event === 'finish') {
          fn();
        }
        return this;
      },
    })),
    filename: original_name,
  };
  const variableValues = {
    input: {
      avatar: fileData,
      clientMutationId,
    },
  };
  const response = await execute({
    contextValue,
    variableValues,
    schema,
    document: uploadAvatarMutation,
  });
  expect(response.errors).toBeUndefined();
  expect(contextValue.fs.createWriteStream).toHaveBeenCalled();
  const avatar = await models.Avatar.findOne({
    where: {
      original_name,
    },
  });
  expect(avatar).not.toBeNull();
  expect(response.data!.uploadAvatar.avatar.id).toEqual(
    toGlobalId('Avatar', avatar!.id),
  );
  expect(response.data!.uploadAvatar.avatar._id).toEqual(avatar!.id);
  await avatar!.destroy();
});
