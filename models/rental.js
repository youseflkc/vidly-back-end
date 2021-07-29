const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const { customerSchema } = require("./customer");
const { movieSchema } = require("./movie");

const rentalSchema = mongoose.Schema({
  customer: {
    type: {
      _id: String,
      name: String,
      phone: String,
    },
    required: true,
  },
  movie: {
    type: {
      _id: String,
      title: String,
      dailyRentalRate: Number,
    },
    required: true,
  },
  rentalDate: {
    type: Date,
    default: Date.now(),
  },
  numberOfDays: {
    type: Number,
  },
  total: {
    type: Number,
    min: 0,
  },
});

const Rental = mongoose.model("Rental", rentalSchema);

const validateRental = (rental) => {
  schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(rental);
};

exports.Rental = Rental;
exports.validateRental = validateRental;
