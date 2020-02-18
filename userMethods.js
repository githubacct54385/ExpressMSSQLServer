const { sequelize, User } = require("./sequelize");
const moment = require("moment");
const { uuid } = require("uuidv4");

function getUtcNow() {
  return moment()
    .utc()
    .format("x");
}

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
    const newId = uuid();

    // run raw query
    await sequelize.query(
      "INSERT INTO dbo.[Users] (Id, Name, Email) VALUES (:id, :name, :email)",
      {
        replacements: { id: newId, name, email, type: sequelize.INSERT }
      }
    );

    // find the user in the db
    const user = await User.findByPk(newId);
    return { success: true, msg: "", user };
  } catch (error) {
    return {
      success: false,
      msg: `Failed to create user.  Reason: ${error}`,
      user: null
    };
  }
}

async function updateUser(id, name, email) {
  try {
    const includeName = name !== null && name !== "";
    const includeEmail = email !== null && email !== "";

    if (includeName && !includeEmail) {
      // update just name
      await User.update(
        {
          Name: name,
          UpdatedAt: getUtcNow()
        },
        { where: { Id: id } }
      );
    } else if (!includeName && includeEmail) {
      // update just email
      await User.update(
        {
          Email: email,
          UpdatedAt: getUtcNow()
        },
        { where: { Id: id } }
      );
    } else {
      // update both name and email
      await User.update(
        {
          Name: name,
          Email: email,
          UpdatedAt: getUtcNow()
        },
        { where: { Id: id } }
      );
    }

    // find the updated user
    const user = await User.findByPk(id);

    return { success: true, msg: "", user: user };
  } catch (error) {
    return { success: false, msg: error, user: null };
  }
}

async function deleteUser(id) {
  try {
    await User.destroy({ where: { Id: id } });
    return { success: true, msg: "" };
  } catch (error) {
    return {
      success: false,
      msg: `Failed to delete user.  Reason: ${error}`
    };
  }
}

module.exports = { getUsers, addUser, deleteUser, updateUser };
