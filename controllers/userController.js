const User = require("../models/usermodel");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.createUserGet = asyncHandler(async (req, res, next) => {
  res.render("registration");
});

exports.createUserPost = [
  body("firstName").trim().escape(),
  body("lastName").trim().escape(),
  body("email")
    .isEmail()
    .withMessage("Enter a valid email")
    .custom(async (value) => {
      const existingEmail = await User.findOne({ email: value }).exec();
      if (existingEmail) {
        throw new Error("Email already exists. Please use another one.");
      }
    })
    .trim()
    .escape(),
  body("password")
    .isLength({ min: 1 })
    .withMessage("Password needs to be at least 1 character")
    .trim()
    .escape(),
  body("cpassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords need to match."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const salt = await bcrypt.genSalt(10);
    const securedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      messages: [],
      admin: false,
      member: false,
      email: req.body.email,
      password: securedPassword,
    });

    if (!errors.isEmpty()) {
      res.render("registration", errors);
    } else {
      await user.save();
      res.redirect("registrationSuccess");
    }
  }),
];

exports.successfullRegistrationGet = asyncHandler(async (req, res, next) => {
  res.render("registrationSuccess");
});

exports.logInUserGet = asyncHandler(async (req, res, next) => {
  res.render("login");
});

exports.logInUserPost = passport.authenticate("local", {
  successRedirect: "dashboard",
  failureRedirect: "login",
});

exports.logOutUserGet = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.dashboardGet = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render("dashboard", { user: req.user });
  }
  res.redirect("login")
});

