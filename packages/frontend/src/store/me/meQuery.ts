import { graphql } from 'babel-plugin-relay/macro';

export const query = graphql`
  query meQuery {
    me {
      id
      name
      email
    }
  }
`;
