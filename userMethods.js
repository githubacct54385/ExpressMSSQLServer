const { sequelize, User } = require("./sequelize");
const moment = require("moment");
const { uuid } = require("uuidv4");

async function getUsers() {
  try {
    // connect and auth
    await sequelize.authenticate();

    // get all users
    const users = await User.findAll();

    return { success: true, error: "", users };
  } catch (error) {
    return { success: false, error, users: [] };
  }
}

async function addUser(name, email) {
  try {
    // add user
    await User.create({
      Id: uuid(),
      Name: name,
      Email: email,
      CreatedAt: moment()
        .utc()
        .format(),
      UpdatedAt: moment()
        .utc()
        .format()
    });
    return { success: true, msg: "" };
  } catch (error) {
    return { success: false, msg: `Failed to create user.  Reason: ${error}` };
  }
}

module.exports = { getUsers, addUser };
