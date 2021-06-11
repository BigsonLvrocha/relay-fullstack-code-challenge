import { execute } from 'graphql';
import gql from 'graphql-tag';
import { hashSync } from 'bcrypt';
import faker from 'faker';

import { toGlobalId } from 'graphql-relay';
import { models, sequelize } from '../../../../db';
import { User } from '../../../../db/models/User';
import { getContext, GraphQLContext } from '../../../context';
import { schema } from '../../..';

const avatarQuery = gql`
  query AvatarQuery($id: ID!) {
    node(id: $id) {
      ... on Avatar {
        _id
        id
        url
        original_name
        path
        created_at
        updated_at
      }
    }
  }
`;

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

it('queries avatar', async () => {
  const avatar = await models.Avatar.create({
    original_name: 'originalAvatar',
    path: 'path/to/originalAvatar.png',
  });
  try {
    const variableValues = {
      id: toGlobalId('Avatar', avatar.id),
    };
    const response = await execute({
      schema,
      contextValue,
      variableValues,
      document: avatarQuery,
    });
    expect(response.errors).toBeUndefined();
    expect(response.data!.node._id).toEqual(avatar.id);
    expect(response.data!.node.id).toEqual(toGlobalId('Avatar', avatar.id));
    expect(response.data!.node.url).toEqual(
      `http://localhost:8000/uploads/${avatar.path}`,
    );
    expect(response.data!.node.original_name).toEqual(avatar.original_name);
    expect(response.data!.node.path).toEqual(avatar.path);
  } finally {
    await avatar.destroy();
  }
});
