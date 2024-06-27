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
    }],
    discount: {
        type: {
            percentage: { type: Number, default: 0 }, 
            fixed: { type: Number, default: 0 } 
        },
        default: {} 
    }
});


productSchema.methods.getFinalPrice = function () {
    if (this.discount) {
        if (this.discount.percentage > 0) {
            return this.price - (this.price * (this.discount.percentage / 100));
        }
        if (this.discount.fixed > 0) {
            return this.price - this.discount.fixed;
        }
    }
    return this.price;
};

module.exports = mongoose.model('Product', productSchema);
