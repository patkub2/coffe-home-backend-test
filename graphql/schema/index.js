const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Product {
  _id: ID!
  title: String!
  description: String!
  category: String!
  value: Float!
  img: String!
  date: String!
}

type User {
  _id: ID!
  username: String!
  password: String
}

input ProductInput {
  title: String!
  description: String!
  category: String!
  value: Float!
  img: String!
  date: String!
}


input UserInput {
  username: String!
  password: String!
}

type RootQuery {
    products: [Product!]!
    users: [User!]!
}

type RootMutation {
  
  createUser(userInput: UserInput): User
    createProduct(productInput: ProductInput): Product
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
