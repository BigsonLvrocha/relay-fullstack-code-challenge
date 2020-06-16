import { Delivery } from '../../../../db/models/Delivery';

export type DeliveryEdge = {
  cursor: string;
  node: Delivery;
};
