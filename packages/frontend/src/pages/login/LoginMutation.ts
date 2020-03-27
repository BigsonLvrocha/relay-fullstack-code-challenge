import { graphql } from 'babel-plugin-relay/macro';

export const mutation = graphql`
  mutation LoginMutation($input: LoginInput!) {
    login(input: $input) {
      token
      error
    }
  }
`;
