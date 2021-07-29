const express = require("express");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const router = express.Router();
const mongoose = require("mongoose");
const { Genre, validateGenre } = require("../models/genre");
const admin = require("../middleware/admin");

router.post("/", async (req, res) => {
  res.status(500).send("Unauthorized");
});

module.exports = router;
