const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tableList = new Schema(
    {
        number_of_chair: {
            type: Number,
            required: true,
        },
        status: {
            type: Boolean,
            required: true,
        },
        //false: hết bàn
        //true: còn bàn
    },
    { timestamps: true }
);
const Table = mongoose.model("TableList", tableList);
module.exports = Table;
