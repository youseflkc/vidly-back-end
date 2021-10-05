const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const { Movie, validateMovie } = require("../models/movie");
const { Genre } = require("../models/genre");

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.id);
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).send("Movie not found");
    res.send(movie);
  } catch (ex) {
    res.send(ex.message);
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.message);

  const movie = new Movie({
    title: req.body.title,
    dailyRentalRate: req.body.dailyRentalRate,
    numberInStock: req.body.numberInStock,
    genre: await Genre.findById(req.body.genreId),
  });
  const result = await movie.save();
  res.send(result);
});

router.put("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid Genre");
  const movie = {
    ...req.body,
    genre: {
      name: genre.name,
      _id: genre._id,
    },
  };
  console.log(movie);

  const { error } = validateMovie(req.body);

  if (error) return res.status(400).send(error.message);
  try {
    const result = await Movie.findByIdAndUpdate(id, movie, {
      new: true,
    });
    console.log(result);
    if (!movie) return res.status(404).send("Movie not found");

    res.send(result);
  } catch (ex) {
    res.send(ex.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    console.log(movie);
    if (!movie) return res.status(404).send("Movie not found");

    res.send(movie);
  } catch (ex) {
    res.send(ex.message);
  }
});

module.exports = router;
