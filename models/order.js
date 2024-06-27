const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Order schema
const orderSchema = new Schema({
    products: [{
        product: {
            type: Object,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    user: {
        email: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'processed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentDetails: {
        method: {
            type: String,
            enum: ['creditCard','wallet'],
            required: true
        },
        transactionId: {
            type: String,
            required: true
        }
    },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

// Middleware to update timestamps
orderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Method to update order status
orderSchema.methods.updateStatus = function (newStatus) {
    this.status = newStatus;
    return this.save();
};

// Method to calculate total amount
orderSchema.methods.calculateTotalAmount = function () {
    this.totalAmount = this.products.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    return this.totalAmount;
};

module.exports = mongoose.model('Order', orderSchema);
