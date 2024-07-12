const bcrypt = require("bcryptjs");
const User = require("../models/user");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

exports.getLogin = (req, res) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/login", {
    path: "/Login",
    pageTitle: "ورود",
    errorMessage: message,
    successMessage: req.flash("success"),
  });
};
