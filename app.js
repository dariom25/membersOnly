const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const User = require("./models/usermodel");
const bcryptjs = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
require("dotenv").config();

const indexRouter = require("./routes/index");

const app = express();

//mongoose setup
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = `mongodb+srv://dario:${process.env.DATABASE_KEY}@cluster0.uuebfsm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


//express-session setup
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.session());

//populate locals object with current user data
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

//load views
app.use("/", indexRouter);

//authenticate user
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ email: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcryptjs.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
