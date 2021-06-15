import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

import {
  makeExecutableSchema,
  mergeResolvers,
  mergeTypeDefs,
  loadFilesSync,
  loadFiles,
} from 'graphql-tools';
import { applyMiddleware } from 'graphql-middleware';

import { middlewares } from './middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function getResolvers() {
  const resolversArray = await loadFiles(
    join(__dirname, 'modules/**/*.resolvers.*s'),
    {
      requireMethod: async (path: string) => {
        return import(pathToFileURL(path).toString());
      },
    },
  );
  return mergeResolvers(resolversArray);
}

function getTypes() {
  const typesArray = loadFilesSync(join(__dirname, 'modules/**/*.graphql'));
  return mergeTypeDefs(typesArray);
}

export async function createSchema() {
  const typeDefs = getTypes();
  const resolvers = await getResolvers();
  const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  return applyMiddleware(executableSchema, ...middlewares);
}

export const schema = await createSchema();
