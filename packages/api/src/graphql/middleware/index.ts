import { shieldMiddleware } from './shield';
import { validatorsMiddleware } from './validators';

export const middlewares = [validatorsMiddleware, shieldMiddleware];
