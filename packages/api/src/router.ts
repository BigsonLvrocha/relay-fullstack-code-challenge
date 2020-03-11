import { resolve } from 'path';

import { execute } from 'graphql-api-koa';
import { graphqlUploadKoa } from 'graphql-upload';
import koaPlayground from 'graphql-playground-middleware-koa';
import { schema } from './graphql';
import { getContext } from './graphql/context';

import send = require('koa-send');
import Router = require('@koa/router');

const router = new Router();

router.get('/hello', ctx => {
  ctx.body = 'hello visitor';
});

router.all('/playground', koaPlayground({ endpoint: '/graphql' }));

router.get('/uploads/:file', ctx => {
  return send(ctx, ctx.params.file, {
    root: resolve(__dirname, '..', 'tmp', 'uploads'),
  });
});

router.post(
  '/graphql',
  graphqlUploadKoa({
    maxFiles: 10,
    maxFileSize: 10000000,
  }),
  execute({
    override: ctx => {
      return {
        schema,
        contextValue: getContext(ctx),
      };
    },
  }),
);

export { router };
