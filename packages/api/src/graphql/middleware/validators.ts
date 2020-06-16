import { join } from 'path';

import { defaultsDeep } from 'lodash';
import { fileLoader } from 'merge-graphql-schemas';

function getValidators() {
  const validators = fileLoader(
    join(__dirname, '..', 'modules', '**', '*.validators.*'),
    { extensions: ['js', 'ts'] },
  );
  return defaultsDeep({}, ...validators);
}

export const validatorsMiddleware = getValidators();
