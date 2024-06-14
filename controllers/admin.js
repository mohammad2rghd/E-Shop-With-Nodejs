const product = require('../models/product');
const Product = require('../models/product');

exports.getProducts = (req, res) => {

    Product.find()
        .then(
            products => {
                res.render('admin/products', {
                    prods: products,
                    pageTitle: 'Admin Products',
                    path: '/admin/products',
                    isAuthenticated: req.session.isLoggedIn,
                });
            }
        ).catch(
            err => {
                console.log(err);
            }
        )

};

exports.getAddProduct = (req, res) => {
    res.render('admin/add-product', {
        path: '/admin/add-product',
        pageTitle: 'Add Product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn,
        
    });
};

exports.postAddProduct = (req, res) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId:req.user._id
    });
    product.save()
        .then(result => {
            res.redirect('/');
        });

}

exports.getEditProduct = (req, res) => {
    const editMode = req.query.edit;

    if (!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId;

    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/add-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product ,
                isAuthenticated: req.session.isLoggedIn,
            });
        }).catch(
            err => {
                console.log(err);
            }
        );


}

exports.postEditProduct = (req, res) => {

    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDesc;
            return product.save();
        }).then(result => {
            console.log("Updated Product...");
            res.redirect('/');
        });

}

exports.postDeleteProduct = (req, res) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId).then(() => {
        console.log("Product Removed");
        res.redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    })
}