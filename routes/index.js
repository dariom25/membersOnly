const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/registration", userController.userRegistrationGet);

module.exports = router;
