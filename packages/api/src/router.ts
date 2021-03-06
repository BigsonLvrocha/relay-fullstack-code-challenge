import { resolve } from 'path';

import { execute } from 'graphql-api-koa';
import { graphqlUploadKoa } from 'graphql-upload';
import koaPlayground from 'graphql-playground-middleware-koa';
import send from 'koa-send';
import { ParameterizedContext } from 'koa';
import Router from '@koa/router';

import { schema } from './graphql';
import { getContext } from './graphql/context';

export function createAppRouter(): Router {
  const router = new Router()
    .get('/hello', (ctx) => {
      ctx.body = 'hello visitor';
    })
    .all('/playground', koaPlayground({ endpoint: '/graphql' }))
    .get('/uploads/:file', (ctx) =>
      send(ctx, ctx.params.file, {
        root: resolve(__dirname, '..', 'tmp', 'uploads'),
      }),
    )
    .post(
      '/graphql',
      graphqlUploadKoa({
        maxFiles: 10,
        maxFileSize: 10000000,
      }),
      execute({
        override: (ctx) =>
          ({
            schema,
            contextValue: getContext((ctx as unknown) as ParameterizedContext),
          } as any),
      }),
    );
  return router;
}
