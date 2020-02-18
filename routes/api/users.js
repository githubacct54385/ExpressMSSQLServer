const express = require("express");
const router = express.Router();
const { uuid } = require("uuidv4");
const { check, validationResult } = require("express-validator");
const moment = require("moment");

const { sequelize, User } = require("../../sequelize");

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

// @route       GET api/users
// @desc        Get all Users
// @access      Public
router.get("/", async (req, res) => {
  const response = await getUsers();
  if (response.success === false) {
    return res.status(500).send("Server Error!");
  }
  return res.json(response);
});

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

// @route       POST api/users
// @desc        Create a User
// @access      Public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;

    try {
      const addRes = await addUser(name, email);
      console.log(addRes);
      if (addRes.success) {
        return res.send("Created"); // created
      } else {
        return res.status(500).send("Server error");
      }
    } catch (error) {
      return res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
