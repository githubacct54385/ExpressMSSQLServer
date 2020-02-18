const { sequelize } = require("./sequelize");

async function connectDb() {
  try {
    await sequelize.authenticate();
    console.log("Connected to db...");
  } catch (error) {
    console.log(`Failed to connect to MSSQL.  ${error}`);
  }
}

module.exports = connectDb;
