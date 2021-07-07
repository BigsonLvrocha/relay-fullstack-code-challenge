import { GraphQLScalarType } from 'graphql';

import { createSchema } from '../../graphql';
import { resolvers } from '../../graphql/modules';

export const GraphQLUpload = new GraphQLScalarType({
  name: 'Upload',
  parseValue: (val) => val,
});

export function createTestSchema() {
  return createSchema({
    resolvers: {
      ...resolvers,
      Upload: GraphQLUpload,
    },
  });
}
