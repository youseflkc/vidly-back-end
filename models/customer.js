const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 25,
  },
  isGold: {
    type: Boolean,
    required: false,
    default: false,
  },
  phone: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

const validateCustomer = (customer) => {
  schema = Joi.object({
    name: Joi.string().required().min(2).max(25),
    isGold: Joi.boolean().required(),
    phone: Joi.string().min(10).max(10),
  });

  return schema.validate(customer);
};

exports.Customer = Customer;
exports.customerSchema = customerSchema;
exports.validate = validateCustomer;
