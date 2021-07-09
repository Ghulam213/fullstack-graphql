const { ApolloServer } = require("apollo-server");
const { typeDefs, inputTypeDefs } = require("./schema");
const resolvers = require("./resolvers");
const { models, db } = require("./db");

const server = new ApolloServer({
  typeDefs: [typeDefs, inputTypeDefs],
  resolvers,
  context() {
    return {
      models,
    };
  },
});

server.listen(4000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
