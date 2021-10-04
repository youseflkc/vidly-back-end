const express = require("express");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const router = express.Router();
const mongoose = require("mongoose");
const { Genre, validateGenre } = require("../models/genre");
const admin = require("../middleware/admin");

router.get("/", async (req, res, next) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const id = req.params.id;

  try {
    const genre = await Genre.findById(id);
    if (!genre) return res.status(404).send("Genre not found");
    res.send(genre);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.message);

  const genre = new Genre({
    name: req.body.name,
  });
  const result = await genre.save();
  res.send(result);
});

router.put("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const genre = req.body;

  const { error } = validateGenre(req.body);

  if (error) return res.status(400).send(error.message);

  const result = await Genre.findByIdAndUpdate(id, genre, {
    new: true,
  });

  if (!genre) return res.status(404).send("Genre not found");

  res.send(result);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send("Genre not found");

  res.send(genre);
});

module.exports = router;
