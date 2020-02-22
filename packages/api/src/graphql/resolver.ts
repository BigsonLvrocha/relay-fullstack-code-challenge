function hello() {
  return 'hello visitor';
}

export const resolvers = {
  Query: {
    hello,
  },
};
