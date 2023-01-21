const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const User = require("./models/user");

//---------DATABASE SETUP------------------
const mongo_uri = process.env.mongo_uri;

// const connect = mongoose.connect(mongo_uri, {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
// });
// connect.then(
//   (db) => {
//     console.log("Database Connected Successfully");
//   },
//   (err) => {
//     console.log("Error occur while connecting ", err);
//   }
// );

mongoose.set('strictQuery', false)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
// --------------------------------------

//-------------GENRAL CONFIGURATION----------
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//-------------------------------------------

//------------ROUTERS------------------------
const commentRoutes = require("./routes/comments");
const postRoutes = require("./routes/posts");
const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
//---------------------------------------------

//------------PASSPORT CONFIGURATION-----------
app.use(
  require("express-session")({
    secret: "I am the best",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//to get current logged in user
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
//------------------------------------------------

app.use("/", indexRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:id/comments", commentRoutes);
app.use("/user", userRoutes);
app.use("/profile", profileRoutes);

let port = process.env.PORT || 3030;

// app.listen(port, () => {
//   console.log(`Server Listening at http://localhost:${port}`);
// });

connectDB().then(() => {
  app.listen(PORT, () => {
      console.log("listening for requests");
  })
})
