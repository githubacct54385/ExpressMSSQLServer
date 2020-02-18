// imports
const express = require("express");
const connectDb = require("./connectDb");

// init server
const app = express();

// test the db connection
connectDb();

// init middleware
app.use(express.json({ extended: false }));

// define routes
app.use("/api/users", require("./routes/api/users"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on Port ${port}`));
