import { pathToFileURL, fileURLToPath } from 'url';
import { join, dirname } from 'path';

import lodash from 'lodash';
import { loadFiles as fileLoader } from 'graphql-tools';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { defaultsDeep } = lodash;

async function getValidators() {
  const validators = await fileLoader(
    join(__dirname, '..', 'modules', '**', '*.validators.*'),
    {
      extensions: ['js', 'ts'],
      requireMethod: async (path: string) => {
        return import(pathToFileURL(path).toString());
      },
    },
  );
  return defaultsDeep({}, ...validators);
}

export const validatorsMiddleware = await getValidators();
