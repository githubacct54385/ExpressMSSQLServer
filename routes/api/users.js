const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { addUser, getUsers } = require("../../userMethods");

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
