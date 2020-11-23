// Requiring necessary npm packages
const express = require("express");
const session = require("express-session");
// Requiring passport as we've configured it
const passport = require("./config/passport");

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 3000;
const db = require("./models");

const routes = require("./routes");
app.use(routes)


// Creating express app and configuring middleware needed for authentication
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static("client/build"));
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
  }
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("./routes/api/html-routes.js")(app);
require("./routes/api-routes.js")(app);
require("./routes/api/profile-api-routes.js")(app);
require("./routes/character-routes.js")(app);
require("./routes/battle-routes")(app);
// Syncing our database and logging a message to the user upon success
// listens to the PORT
db.sequelize.sync({force:false}).then(function() {
    app.listen(PORT, function() {
        console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    });
});