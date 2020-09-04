const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type Cart {
  _id: ID!
  user: User!
  product: Product!
  createdAt: String!
  updatedAt: String!
}

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
    cart: [Cart!]!
}

type RootMutation {
    createProduct(productInput: ProductInput): Product
    createUser(userInput: UserInput): User
    AddToCart(productId: ID!): Cart!
    RemoveFromCart(cartId: ID!): Cart!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
