const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tableList = new Schema({

    _id: {
        type: Schema.Types.ObjectId,
    },

    number_of_chair: {
        type: Number,
        required: true

    },
    status: {
        type: Boolean,
        required: true
    }
    //false: hết bàn 
    //true: còn bàn
});
const Table= mongoose.model('TableList', tableList);
module.exports = Table
