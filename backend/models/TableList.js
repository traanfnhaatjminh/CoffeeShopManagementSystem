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
  location_table: Number,
  isTakeaway: {
    type: Boolean,
    default: false,
  },
  table_name: {
    type: String,
    required: true,
  },
  //false: hết bàn
  //true: còn bàn
});
<<<<<<< HEAD
=======

>>>>>>> MinhTN
const Table = mongoose.model("TableList", tableList);
module.exports = Table;
