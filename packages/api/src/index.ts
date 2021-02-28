import { errorHandler } from 'graphql-api-koa';
import Bodyparser from 'koa-bodyparser';
import Koa from 'koa';
import logger from 'koa-logger';
import cors from '@koa/cors';

import { errorMiddleware } from './middleware/errorMiddleware';
import { authMiddleware } from './middleware/authMiddleware';
import { router } from './router';

const app = new Koa();

app.use(cors());
app.use(Bodyparser());
app.use(logger());
app.use(errorHandler());
app.use(errorMiddleware);
app.use(authMiddleware);
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8000, () => {
  // eslint-disable-next-line no-console
  console.log('server is running');
});
