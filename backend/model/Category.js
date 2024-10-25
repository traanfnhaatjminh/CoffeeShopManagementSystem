const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({

    _id: {
        type: Schema.Types.ObjectId,  
    },

    group_name: {
        type: String,
        required: true
    },
    category_name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Category', categorySchema);
