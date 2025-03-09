const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tableList = new Schema({
  number_of_chair: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  location_table: {
    type: String,
    required: true,
    enum: [
      "indoor",
      "outdoor",
      ...Array.from({ length: 10 }, (_, i) => `floor_${i + 1}`),
    ],
  },
  isTakeaway: {
    type: Boolean,
    default: false,
  },
  table_name: {
    type: String,
    required: true,
  },
  // false: hết bàn
  // true: còn bàn
});

const Table = mongoose.model("TableList", tableList);
module.exports = Table;
