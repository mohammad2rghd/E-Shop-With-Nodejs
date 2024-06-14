const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);


const User = require('./models/user');

const MONGODB_URI = 'mongodb://localhost/Shop';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'session'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');



app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));



app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id).then(user => {
        req.user = user;
        next();
    }).catch(err => {
        console.log(err);
    })
});


app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);



mongoose.connect(MONGODB_URI)
    .then(result => {
        User.findOne().then(user => {

            if (!user) {
                const user = new User({
                    name: 'Mohammad',
                    email: 'mohammad@test.com',
                    cart: {
                        items: []
                    }
                });

                user.save();
            }

        });
        app.listen(3000, () => {
            console.log('Listening on port 3000');
        });
    })
    .catch(
        err => {
            console.log(err);
        }
    )