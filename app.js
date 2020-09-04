const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");

const app = express();

app.use(bodyParser.json());

const port = process.env.PORT || 5000;

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
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
