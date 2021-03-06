import { execute } from 'graphql';
import gql from 'graphql-tag';
import { hashSync } from 'bcrypt';
import faker from 'faker';

import { models, sequelize } from '../../../../db';
import { getContext } from '../../../context';
import { schema } from '../../..';

const loginMutation = gql`
  mutation LoginMutation($input: LoginInput!) {
    login(input: $input) {
      error
      token
      clientMutationId
    }
  }
`;

afterAll(async () => {
  await sequelize.close();
});

it('logs in user', async () => {
  const password = faker.random.alphaNumeric();
  const clientMutationId = faker.random.uuid();
  const user = await models.User.create({
    name: faker.name.firstName(),
    email: `e${faker.random.uuid()}@team.com.br`,
    password_hash: hashSync(password, 10),
  });
  const context = getContext({ state: {} } as any);
  const variables = {
    input: {
      clientMutationId,
      email: user.email,
      password,
    },
  };
  const response = await execute({
    document: loginMutation,
    variableValues: variables,
    schema,
    contextValue: context,
  });
  expect(response.errors).toBeUndefined();
  expect(response.data!.login.error).toBeNull();
  expect(response.data!.login.clientMutationId).toEqual(clientMutationId);
  expect(response.data!.login.token).not.toBeNull();
});

it('doest not log in user with wrong password', async () => {
  const password = faker.random.alphaNumeric();
  const clientMutationId = faker.random.uuid();
  const user = await models.User.create({
    name: faker.name.firstName(),
    email: `e${faker.random.uuid()}@team.com.br`,
    password_hash: hashSync(password, 10),
  });
  const context = getContext({ state: {} } as any);
  const variables = {
    input: {
      clientMutationId,
      email: user.email,
      password: `${password}1234`,
    },
  };
  const response = await execute({
    document: loginMutation,
    variableValues: variables,
    schema,
    contextValue: context,
  });
  expect(response.errors).toBeUndefined();
  expect(response.data!.login.error).toHaveLength(1);
  expect(response.data!.login.error[0]).toEqual('invalid email or password');
  expect(response.data!.login.clientMutationId).toEqual(clientMutationId);
  expect(response.data!.login.token).toBeNull();
});

it('does not log in non existent user', async () => {
  const password = faker.random.alphaNumeric();
  const clientMutationId = faker.random.uuid();
  const user = await models.User.create({
    name: faker.name.firstName(),
    email: `e${faker.random.uuid()}@team.com.br`,
    password_hash: hashSync(password, 10),
  });
  const context = getContext({ state: {} } as any);
  const variables = {
    input: {
      clientMutationId,
      email: `123${user.email}`,
      password,
    },
  };
  const response = await execute({
    document: loginMutation,
    variableValues: variables,
    schema,
    contextValue: context,
  });
  expect(response.errors).toBeUndefined();
  expect(response.data!.login.error).toHaveLength(1);
  expect(response.data!.login.error[0]).toEqual('invalid email or password');
  expect(response.data!.login.clientMutationId).toEqual(clientMutationId);
  expect(response.data!.login.token).toBeNull();
});
