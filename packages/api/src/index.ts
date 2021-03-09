import { createServer } from './server';

createServer().app.listen(8000, () => {
  // eslint-disable-next-line no-console
  console.log('server is running');
});
