import { allow } from 'graphql-shield';

export default {
  DeliveryMan: allow,
  DeliveryConnection: allow,
  DeliveryEdge: allow,
  Delivery: allow,
  Recipient: allow,
  Avatar: allow,
  PageInfo: allow,
  Query: {
    deliveryMan: allow,
  },
};
