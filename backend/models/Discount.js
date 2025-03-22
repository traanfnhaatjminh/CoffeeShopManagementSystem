const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Discounts = new Schema({});

const Discount = mongoose.model("Discount", Discounts);
module.exports = Discount;
