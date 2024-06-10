const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/registration", function (req, res, next) {
  res.render("registration");
});

module.exports = router;
