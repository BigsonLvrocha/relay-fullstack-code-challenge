import { graphql } from 'babel-plugin-relay/macro';

export const query = graphql`
  query deliveriesQuery($first: NonNegativeInt, $after: String) {
    deliveries(first: $first, after: $after) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
      }
      edges {
        cursor
        node {
          id
          recipient {
            name
            city
            state
          }
          deliveryMan {
            name
            avatar {
              url
            }
          }
          status
        }
      }
    }
  }
`;
