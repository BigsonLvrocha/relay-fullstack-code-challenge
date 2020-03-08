import { Models } from '../../db';
import { getLoader as getRecipientLoader } from './Recipient';
import { getLoader as getUserLoader } from './User';

export function getLoaders(models: Models) {
  return {
    User: getUserLoader(models),
    Recipient: getRecipientLoader(models),
  };
}
