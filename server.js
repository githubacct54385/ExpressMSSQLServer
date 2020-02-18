// imports
const express = require("express");
const expressGraphQL = require("express-graphql");
const schema = require("./schema");
const connectDb = require("./connectDb");

// init server
const app = express();

// test the db connection
connectDb();

app.use(
  "/graphql",
  expressGraphQL({
    schema,
    graphiql: process.env.NODE_ENV === "production" ? false : true
  })
);

// init middleware
app.use(express.json({ extended: false }));

// define routes
app.use("/api/users", require("./routes/api/users"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on Port ${port}`));
