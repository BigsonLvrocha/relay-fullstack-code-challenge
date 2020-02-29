import { errorHandler } from 'graphql-api-koa';
import { router } from './router';
import { errorMiddleware } from './middleware/errorMiddleware';
import { authMiddleware } from './middleware/authMiddleware';

import Bodyparser = require('koa-bodyparser');
import Koa = require('koa');

const app = new Koa();

app.use(Bodyparser());
app.use(errorHandler());
app.use(errorMiddleware);
app.use(authMiddleware);
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8000, () => {
  // eslint-disable-next-line no-console
  console.log('server is running');
});
