const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const movieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    trim: true,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    default: 0,
    required: false,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

const validateMovie = (movie) => {
  schema = Joi.object({
    title: Joi.string().required().min(5),
    genreId: Joi.string().required(),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number().required().max(10).min(0),
  });

  return schema.validate(movie);
};

exports.Movie = Movie;
exports.movieSchema = movieSchema;
exports.validateMovie = validateMovie;
