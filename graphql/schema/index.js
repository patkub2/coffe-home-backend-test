const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Product {
  _id: ID!
  title: String!
  description: String!
  price: Float!
  category: String!
  creator: User!
}

type User {
  _id: ID!
  email: String!
  password: String
  createdProducts: [Product!]
}

input ProductInput {
  title: String!
  description: String!
  price: Float!
  category: String!
}

input UserInput {
  email: String!
  password: String!
}

type RootQuery {
    products: [Product!]!
}

type RootMutation {
    createProduct(productInput: ProductInput): Product
    createUser(userInput: UserInput): User
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
