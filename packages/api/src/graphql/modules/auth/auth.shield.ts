import { allow } from 'graphql-shield';

export default {
  Mutation: {
    login: allow,
  },
  LoginPayload: allow,
};
