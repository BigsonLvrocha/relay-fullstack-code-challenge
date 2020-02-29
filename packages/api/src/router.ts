import { execute } from 'graphql-api-koa';

import koaPlayground from 'graphql-playground-middleware-koa';
import { schema } from './graphql';
import { getContext } from './graphql/context';

import Router = require('@koa/router');

const router = new Router();

router.get('/hello', ctx => {
  ctx.body = 'hello visitor';
});

router.all('/playground', koaPlayground({ endpoint: '/graphql' }));

router.post(
  '/graphql',
  execute({
    schema,
    contextValue: getContext(),
  }),
);

export { router };
