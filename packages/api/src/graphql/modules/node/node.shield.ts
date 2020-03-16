import { allow } from 'graphql-shield';

const shield = {
  Query: {
    node: allow,
  },
};

export default shield;
