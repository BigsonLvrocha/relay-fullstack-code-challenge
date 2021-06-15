import { pathToFileURL, fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


function getValidators() {
  const validators = fileLoader(
    join(__dirname, '..', 'modules', '**', '*.validators.*'),
    { extensions: ['js', 'ts'] },
  );
  return defaultsDeep({}, ...validators);
}

export const validatorsMiddleware = getValidators();
