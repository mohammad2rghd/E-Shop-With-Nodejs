const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrls: [{
        type: String,
        required: true
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }]
});

module.exports = mongoose.model('Product', productSchema);
