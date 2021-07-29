const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const { Rental, validateRental } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const { custom } = require("joi");

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-rentalDate");
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const rental = await Rental.findById(id);
    if (!rental) return res.status(404).send("Rental not found");
    res.send(rental);
  } catch (ex) {
    res.send(ex.message);
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid Customer");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid Movie");

  const rental = new Rental({
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
  } catch (ex) {
    res.status(500).send("Internal Error");
  }

  res.send(rental);
});

router.put("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const movie = await Movie.findById(req.body.movieId);
  const customer = await Customer.findById(req.body.customerId);
  if (movie) return res.status(400).send("Invalid Movie");
  if (customer) return res.status(400).send("Invalid Customer");
  const rental = {
    ...req.body,
    movie: { ...movie },
    customer: { ...customer },
  };

  const { error } = validateRental(rental);

  if (error) return res.status(400).send(error.message);
  try {
    const result = await Rental.findByIdAndUpdate(id, rental, {
      new: true,
    });
    console.log(result);
    if (!movie) return res.status(404).send("Rental not found");

    res.send(result);
  } catch (ex) {
    res.send(ex.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const movie = await Rental.findByIdAndRemove(req.params.id);
    console.log(movie);
    if (!movie) return res.status(404).send("Rental not found");

    res.send(movie);
  } catch (ex) {
    res.send(ex.message);
  }
});

module.exports = router;
