import { allow } from 'graphql-shield';

const shield = {
  Mutation: {
    createDeliveryProblem: allow,
  },
  CreateDeliveryProblemPayload: allow,
  DeliveryProblem: allow,
};

export default shield;
