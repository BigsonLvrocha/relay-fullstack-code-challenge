import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import {
  makeExecutableSchema,
  mergeTypeDefs,
  loadFilesSync,
} from 'graphql-tools';
import { applyMiddleware } from 'graphql-middleware';

import { middlewares } from './middleware';
import { resolvers as defaultResolvers } from './modules';
import { GQLResolvers } from './generated/schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getTypes() {
  const typesArray = loadFilesSync(join(__dirname, 'modules/**/*.graphql'));
  return mergeTypeDefs(typesArray);
}

type CreateSchemaOptions = {
  resolvers?: GQLResolvers;
};

export function createSchema({
  resolvers = defaultResolvers,
}: CreateSchemaOptions = {}) {
  const typeDefs = getTypes();
  const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  return applyMiddleware(executableSchema, ...middlewares);
}
