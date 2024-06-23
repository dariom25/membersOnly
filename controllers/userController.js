const User = require("../models/usermodel");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs")

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
        throw new Error("Email already exists. Please use another one.")
      }
    })
    .trim()
    .escape(),
  body("password").trim().escape(),
  body("admin.*").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const salt = await bcrypt.genSalt(10)
    const securedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        messages: [],
        admin: false,
        member: false,
        email: req.body.email,
        password: securedPassword
    })

    if (!errors.isEmpty()) {
        res.render("registration")
    } else {
      await user.save()
      res.redirect("registrationSuccess")
    }
  })
];
