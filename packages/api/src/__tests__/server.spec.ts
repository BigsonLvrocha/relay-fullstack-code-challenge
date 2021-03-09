import http from 'http';
import req from 'supertest';
import { createServer } from '../server';

const query = `
  query HelloQuery {
    hello
  }
`;

const { app } = createServer();
const server = http.createServer(app.callback());

it('greets the graphql schema', async () => {
  const result = await req(server)
    .post('/graphql')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({
      query,
      variables: {},
    })
    .expect(200);
  expect(result.body.errors).toBeUndefined();
  expect(result.body.data.hello).toEqual('hello visitor');
});
