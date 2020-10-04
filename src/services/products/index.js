const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Query {
    topProducts(first: Int = 5): [Product]
    products: [Product]
    product(product: FindProduct): Product
  }

  type Product @key(fields: "upc") {
    upc: String!
    name: String
    price: Int
    weight: Int
  }

  input FindProduct {
    upc: ID!
  }
`;

const resolvers = {
  Product: {
    __resolveReference(object) {
      return products.find((product) => product.upc === object.upc);
    },
  },
  Query: {
    topProducts: (_, args) => {
      return products.slice(0, args.first);
    },
    products: (_, args) => {
      return products;
    },
    product: (_, args) => {
      const { product } = args;

      return products.find((p) => p.upc == product.upc);
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

server.listen({ port: 4003 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const products = [
  {
    upc: "1",
    name: "Table",
    price: 899,
    weight: 100,
  },
  {
    upc: "2",
    name: "Couch",
    price: 1299,
    weight: 1000,
  },
  {
    upc: "3",
    name: "Chair",
    price: 54,
    weight: 50,
  },
];
