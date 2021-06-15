import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

import { shield } from 'graphql-shield';
import { fileLoader } from 'merge-graphql-schemas';
import { defaultsDeep } from 'lodash';

import createError from 'http-errors';
import { isAdmin } from '../rules';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getRuleTree() {
  const rules = fileLoader(
    join(__dirname, '..', 'modules', '**', '*.shield.*'),
    { extensions: ['js', 'ts'] },
  );
  return defaultsDeep({}, ...rules);
}

export const shieldMiddleware = shield(getRuleTree(), {
  fallbackRule: isAdmin,
  fallbackError: createError(500, 'Internal server error!'),
  debug: process.env.NODE_ENV !== 'production',
});
