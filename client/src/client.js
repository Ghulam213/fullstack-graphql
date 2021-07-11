import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import gql from "graphql-tag";

const typeDefs = gql`
  extend type Pet {
    vaccinated: Boolean!
  }
`;

const resolvers = {
  Pet: {
    vaccinated() {
      return true;
    },
  },
};

const http = new HttpLink({ uri: "http://localhost:4000" });

const delay = setContext(
  (request) =>
    new Promise((success, fail) => {
      setTimeout(() => {
        success();
      }, 800);
    })
);

const link = ApolloLink.from([delay, http]);
const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
  typeDefs,
  resolvers,
});

export default client;
