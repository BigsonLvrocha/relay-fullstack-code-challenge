import { execute } from 'graphql';
import gql from 'graphql-tag';
import { hashSync } from 'bcrypt';
import faker from 'faker';
import fs from 'fs';

import { toGlobalId } from 'graphql-relay';
import { models, sequelize } from '../../../../db';
import { User } from '../../../../db/models/User';
import { getContext, GraphQLContext } from '../../../context';
import { schema } from '../../..';

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

const spy = jest.spyOn(fs, 'createWriteStream').mockImplementation(
  () =>
    ({
      pipe: jest.fn(function pipeMock(this: jest.Mock) {
        return this;
      }),
      on(event: string, fn: () => {}) {
        if (event === 'finish') {
          fn();
        }
        return this;
      },
    } as any),
);

let user: User;
let contextValue: GraphQLContext;

beforeAll(async () => {
  user = await models.User.create({
    name: faker.name.firstName(),
    email: `e${faker.random.uuid()}@team.com.br`,
    password_hash: hashSync('1234', 10),
  });
  contextValue = getContext({ state: { user } } as any);
});

afterAll(async () => {
  await user.destroy();
  await sequelize.close();
});

it('creates a new avatar', async () => {
  const original_name = `${faker.random.uuid()}.png`;
  const clientMutationId = faker.random.uuid();
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
  expect(spy).toHaveBeenCalled();
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
