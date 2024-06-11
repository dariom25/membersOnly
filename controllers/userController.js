const User  = require("../models/usermodel")
const asyncHandler = require("express-async-handler")

exports.createUserGet = asyncHandler(async (req, res, next) => {
    res.render("registration")
})