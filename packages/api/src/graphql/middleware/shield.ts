import { join } from 'path';

import { shield } from 'graphql-shield';
import { fileLoader } from 'merge-graphql-schemas';
import { defaultsDeep } from 'lodash';

import { isAdmin } from '../rules';

import createError = require('http-errors');

function getRuleTree() {
  const rules = fileLoader(
    join(__dirname, '..', 'modules', '**', '*.shield.*'),
    { extensions: ['js', 'ts'] },
  );
  return defaultsDeep({}, ...rules);
}

export const shieldMiddleware = shield(getRuleTree(), {
  fallbackRule: isAdmin,
  fallbackError: createError(401, 'Not Authorised!'),
});
