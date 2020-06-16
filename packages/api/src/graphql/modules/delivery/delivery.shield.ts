import { allow } from 'graphql-shield';

const shield = {
  Mutation: {
    pickupDelivery: allow,
    closeDelivery: allow,
  },
  PickupDeliveryPayload: allow,
  CloseDeliveryPayload: allow,
};

export default shield;
