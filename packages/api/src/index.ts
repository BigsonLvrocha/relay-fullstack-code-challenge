import { router } from './router';

import Koa = require('koa');

const app = new Koa();

app.use((ctx, next) => {
  ctx.body = 'hello world';
  return next();
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8000, () => {
  // eslint-disable-next-line no-console
  console.log('server is running');
});
