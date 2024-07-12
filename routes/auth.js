const express = require("express");
const { check, body } = require("express-validator");

const router = express.Router();

const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);
module.exports = router;
