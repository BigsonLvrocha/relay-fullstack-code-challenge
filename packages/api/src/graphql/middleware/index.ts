import { shieldMiddleware } from './shield';
import { validatorsMiddleware } from './validators';
import { mutationMiddleware } from './mutation';

export const middlewares = [
  shieldMiddleware,
  mutationMiddleware,
  validatorsMiddleware,
];
