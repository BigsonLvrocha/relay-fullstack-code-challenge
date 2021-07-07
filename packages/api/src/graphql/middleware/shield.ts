import { shield } from 'graphql-shield';
import createError from 'http-errors';

import { isAdmin } from '../rules';
import { shield as schemaShield } from '../modules';

export const shieldMiddleware = shield(schemaShield, {
  fallbackRule: isAdmin,
  fallbackError: createError(500, 'Internal server error!'),
  debug: process.env.NODE_ENV !== 'production',
});
