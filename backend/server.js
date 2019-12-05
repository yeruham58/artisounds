const express = require("express");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const projects = require("./routes/api/projects");
const projectNotifications = require("./routes/api/projectNotifications");
const uploadProfileImg = require("./routes/api/uploadProfileImg");
const uploadPostMedia = require("./routes/api/uploadPostMedia");
const uploadRecord = require("./routes/api/uploadRecord");
const bodyParser = require("body-parser");
const passport = require("passport");

const cors = require("cors");

const app = express();

//body parser
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// connect to postgresDB
const db = require("./config/database.js");

db.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

//passport middleware
app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

//use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);
app.use("/api/projects", projects);
app.use("/api/projectNotifications", projectNotifications);
app.use("/api/upload", uploadProfileImg);
app.use("/api/upload", uploadPostMedia.router);
app.use("/api/records", uploadRecord);

const port = process.env.PORT || 5000;

// const controlArtDB = require("./controlArtTypes");

app.listen(port, () => console.log(`server runing on port ${port}`));
