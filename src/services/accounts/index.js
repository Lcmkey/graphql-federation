const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Query {
    me: User
    user(user: FindUserInput): User
    users: [User]
  }

  type User @key(fields: "id") {
    id: ID!
    name: String
    username: String
  }

  input FindUserInput {
    id: ID!
  }
`;

const resolvers = {
  Query: {
    me: () => {
      return users[0];
    },
    user: (parent, args) => {
      const { user } = args;

      return users.find((u) => u.id == user.id);
    },
    users: () => {
      return users;
    },
  },
  User: {
    __resolveReference(parent) {
      return users.find((user) => user.id === parent.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const users = [
  {
    id: "1",
    name: "Ada Lovelace",
    birthDate: "1815-12-10",
    username: "@ada",
  },
  {
    id: "2",
    name: "Alan Turing",
    birthDate: "1912-06-23",
    username: "@complete",
  },
];
