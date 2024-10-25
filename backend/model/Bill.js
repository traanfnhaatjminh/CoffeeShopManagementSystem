const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const billSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
  },
  created_time: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_time: {
    type: Date,
    required: true,
    default: Date.now,
  },
  total_cost: {
    type: Number,
    required: true,
  },
  table_id: {
    type: Schema.Types.ObjectId,
    ref: "TableList",
  },
  payment:{
    type: String,
  },
  status: Number,
  discount: Number,
  product_list: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      nameP: {
        type: String,
        required: true,
      },
      imageP: {
        type: String,
        required: true,
      },
      quantityP: {
        type: Number,
        required: true,
      },
      priceP: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      _id: false,
    },
  ],
});

const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
