const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/registration", userController.createUserGet);

router.post("/registration", userController.createUserPost);

router.get("/registrationSuccess", userController.successfullRegistrationGet);

router.get("/login", userController.logInUserGet);

router.post("/login", userController.logInUserPost);

router.get("/log-out", userController.logOutUserGet);

router.get("/dashboard", userController.dashboardGet);

router.post("/dashboard", userController.setMemberStatusPost)

module.exports = router;
