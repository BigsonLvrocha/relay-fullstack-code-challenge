import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

import { shield } from 'graphql-shield';
import { loadFiles } from 'graphql-tools';
import lodash from 'lodash';
import createError from 'http-errors';

import { isAdmin } from '../rules';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { defaultsDeep } = lodash;

async function getRuleTree() {
  const rules = await loadFiles(
    join(__dirname, '..', 'modules', '**', '*.shield.*'),
    {
      extensions: ['js', 'ts'],
      requireMethod: async (path: string) => {
        return import(pathToFileURL(path).toString());
      },
    },
  );
  return defaultsDeep({}, ...rules);
}

export const shieldMiddleware = shield(await getRuleTree(), {
  fallbackRule: isAdmin,
  fallbackError: createError(500, 'Internal server error!'),
  debug: process.env.NODE_ENV !== 'production',
});
