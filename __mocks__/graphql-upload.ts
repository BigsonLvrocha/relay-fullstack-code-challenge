import { GraphQLScalarType } from 'graphql';

export const GraphQLUpload = new GraphQLScalarType({
  name: 'Upload',
  parseValue: (val) => val,
});
