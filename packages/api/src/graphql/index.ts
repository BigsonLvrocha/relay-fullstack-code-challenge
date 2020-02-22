import { join } from 'path';
import { readFileSync } from 'fs';

import { makeExecutableSchema } from 'graphql-tools';

import { resolvers } from './resolver';

function createSchema() {
  const schemaTxt = readFileSync(join(__dirname, 'schema.graphql'), {
    encoding: 'utf-8',
  });
  const executableSchema = makeExecutableSchema({
    typeDefs: schemaTxt,
    resolvers,
  });
  return executableSchema;
}

export const schema = createSchema();
