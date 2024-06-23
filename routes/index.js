const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/registration", userController.createUserGet);

router.post("/registration", userController.createUserPost);

router.get("/registrationSuccess", userController.successfullRegistrationGet)

module.exports = router;
