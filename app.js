const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const Product = require("./models/product");
const User = require("./models/user");

const app = express();

app.use(bodyParser.json());
const port = process.env.PORT || 5000;

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
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
    `),
    rootValue: {
      //////////////////////////////////////////////
      products: () => {
        return Product.find()
          .then((product) => {
            return product.map((product) => {
              return { ...product._doc, _id: product.id };
            });
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      createProduct: (args) => {
        const product = new Product({
          title: args.productInput.title,
          description: args.productInput.description,
          category: args.productInput.category,
          value: +args.productInput.value,
          img: args.productInput.img,
          date: new Date(args.productInput.date),
        });
        return product
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc, _id: result.id };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      //////////////////////////////////////////////
      users: () => {
        return User.find()
          .then((user) => {
            return user.map((user) => {
              return { ...user._doc, _id: user.id };
            });
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },

      createUser: (args) => {
        const user = new User({
          username: args.userInput.username,
          password: args.userInput.password,
        });
        return User.findOne({ username: args.userInput.username })
          .then((oneuser) => {
            if (oneuser) {
              throw new Error("this username exists alredy.");
            }

            return user.save();
          })

          .then((result) => {
            console.log(result);
            console.log("addeeddddd");
            return { ...result._doc, _id: result.id };
          })
          .catch((err) => {
            console.log(err);
            console.log("cU");
            throw err;
          });
      },
      //////////////////////////////////////////////
    },
    graphiql: true,
  })
);

mongoose.connect(
  "mongodb+srv://patkub:zse45tgb@cluster0.8awhw.gcp.mongodb.net/coffe-home-backend-test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useCreateIndex: true }
);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
