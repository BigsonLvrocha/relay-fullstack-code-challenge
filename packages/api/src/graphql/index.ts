import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { makeExecutableSchema } from 'graphql-tools';
import { applyMiddleware } from 'graphql-middleware';

import { middlewares } from './middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getResolvers() {
  const resolversArray = fileLoader(
    join(__dirname, 'modules/**/*.resolvers.*s'),
  );
  return mergeResolvers(resolversArray);
}

function getTypes() {
  const typesArray = fileLoader(join(__dirname, 'modules/**/*.graphql'));
  return mergeTypes(typesArray);
}

function createSchema() {
  const typeDefs = getTypes();
  const resolvers = getResolvers();
  const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  return applyMiddleware(executableSchema, ...middlewares);
}

export const schema = createSchema();
