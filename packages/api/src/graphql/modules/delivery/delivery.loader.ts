import { toGlobalId } from 'graphql-relay';
import { Delivery } from '../../../db/models/Delivery';

export function model2cursor(model: Delivery) {
  const { created_at, id } = model;
  return toGlobalId('DeliveryEdgeCursor', `${created_at.getTime()}:${id}`);
}
