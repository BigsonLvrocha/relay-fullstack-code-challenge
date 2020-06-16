import { allow } from 'graphql-shield';

export default {
  Query: {
    hello: allow,
  },
};
