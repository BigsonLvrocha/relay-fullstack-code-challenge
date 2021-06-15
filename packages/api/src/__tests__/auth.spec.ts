import { promisify } from 'util';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import http from 'http';
import gql from 'graphql-tag';
import req from 'supertest';
import faker from 'faker';
import { createServer } from '../server';
import { models, sequelize } from '../db';

const query = gql`
  query HelloQuery {
    hello
  }
`.loc!.source.body;

const { app } = createServer();
const server = http.createServer(app.callback());

afterAll(async () => {
  await sequelize.close();
});

const signAsync = promisify<
  string | Buffer | object,
  Secret,
  SignOptions,
  string
>(jwt.sign);

it('greets the graphql schema', async () => {
  const user = await models.User.create({
    name: faker.name.firstName(),
    email: `e${uuid()}@team.com.br`,
    password_hash: '1234',
  });
  try {
    const token = await signAsync(
      { userId: user.id },
      process.env.API_SECRET as string,
      {
        expiresIn: '7d',
      },
    );
    const result = await req(server)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .send({
        query,
        variables: {},
      })
      .expect(200);
    expect(result.body.errors).toBeUndefined();
    expect(result.body.data.hello).toEqual(`hello ${user.name}`);
  } finally {
    await user.destroy();
  }
});
