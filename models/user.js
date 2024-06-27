const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const discountSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    }
});





const userSchema = new Schema({

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: 8,
        maxlength: 30
    },
    password: {
        type: String,
        required: true,
    },
    resetToken:String,
    expiredDateResetToken:Date,
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    },
    role: {
        type: String,
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    discounts: [discountSchema]
});


//add product to cart in user model

userSchema.methods.addTocart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString()
    });
    let newQuantity = 1;
    const updatedcartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedcartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedcartItems.push({
            productId: product._id,
            quantity: newQuantity
        })
    }

    const updatedCart = {
        items: updatedcartItems
    };
    this.cart = updatedCart;
    return this.save();

}


//remove from cart  in user model
userSchema.methods.removeFromCart = function (productId) {
    const updatedcartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString()
    });
    this.cart.items = updatedcartItems;
    return this.save();
}

// clear cart
userSchema.methods.clearCart = function () {
    this.cart = {
        items: []
    };
    return this.save();
}
//add discount
userSchema.methods.addDiscount = function (discount) {
    this.discounts.push(discount);
    return this.save();
};
//remove Expired Discounts
userSchema.methods.removeExpiredDiscounts = function () {
    const currentDate = new Date();
    this.discounts = this.discounts.filter(discount => discount.expirationDate > currentDate);
    return this.save();
};


module.exports = mongoose.model('User', userSchema);
