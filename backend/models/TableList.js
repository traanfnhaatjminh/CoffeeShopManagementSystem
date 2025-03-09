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
      "takeaway",
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
  x: {
    type: Number,
    default: 0, // Vị trí x trên sơ đồ
  },
  y: {
    type: Number,
    default: 0, // Vị trí y trên sơ đồ
  },
});

const Table = mongoose.model("TableList", tableList);
module.exports = Table;
