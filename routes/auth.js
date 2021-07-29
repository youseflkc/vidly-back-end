const express = require("express");
const router = express.Router();
const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid Email/Password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Email/Password.");

  const token = user.generateAuthToken();
  res.send(token);
});

const validate = (req) => {
  schema = Joi.object({
    email: Joi.string().required().max(255).email(),
    password: Joi.string().max(255).required(),
  });

  return schema.validate(req);
};

module.exports = router;
