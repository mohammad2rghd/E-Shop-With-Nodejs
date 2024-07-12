//built-in packages
const path = require("path");

//installed packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
//register environmetal varialbles
require("dotenv").config();

//models
const User = require("./models/user");

//routes
const authRouter = require("./routes/auth");
const shopRouter = require("./routes/shop");

//...
let port = process.env.PORT || 3000;
let host = process.env.HOST;
let databaseName = process.env.DATABASE_NAME;
let databaseHost = process.env.DATABASE_HOST;

const MONGODB_URI = `mongodb://${databaseHost}/${databaseName}`;

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "session",
});

//setting view engine
app.set("view engine", "ejs");
app.set("views", "views");

//bodyparser
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//session middleware
app.use(
  session({
    secret: "my secret key to encode cookies",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//flash middleware
app.use(flash());

//put  properties in every response data
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;

  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});

app.use((error, req, res, next) => {
  // res.status(error.httpstatuscode)
  return res.status(500).render("500", {
    pageTitle: "Error",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

//routes
app.use(authRouter);
app.use(shopRouter);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(port, () => {
      console.log("URL : " + `http://${host}:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
