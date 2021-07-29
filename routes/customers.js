const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const { Customer, validate } = require("../models/customer");

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).send("Customer not found");
  } catch (ex) {
    res.send(ex.message);
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const customer = new Customer(req.body);
  const result = await customer.save();
  res.send(result);
});

router.put("/:id",auth, async (req, res) => {
  const id = req.params.id;
  const customer = req.body;

  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.message);

  const result = await Customer.findByIdAndUpdate(id, customer, {
    new: true,
  });

  if (!customer) return res.status(404).send("Customer not found");

  res.send(result);
});

router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) return res.status(404).send("Genre not found");

  res.send(customer);
});

module.exports = router;
