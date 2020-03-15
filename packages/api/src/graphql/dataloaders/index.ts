import { Models } from '../../db';
import { getLoader as getRecipientLoader } from './Recipient';
import { getLoader as getUserLoader } from './User';
import { getLoader as getAvatarLoader } from './Avatar';
import { getLoader as getDeliveryManLoader } from './DeliveryMan';
import { getLoader as getDeliveryLoader } from './Delivery';

export function getLoaders(models: Models) {
  return {
    User: getUserLoader(models),
    Recipient: getRecipientLoader(models),
    Avatar: getAvatarLoader(models),
    DeliveryMan: getDeliveryManLoader(models),
    Delivery: getDeliveryLoader(models),
  };
}
