const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const { config } = require("dotenv");

const app = express();

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "thirty-two",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true,
  })
);

// Express is a middleware for middleware and handling various API routes
const db = require("./app/models");
const Role = db.role;

config();
db.mongoose
  .connect(process.env.dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to 32Analytics." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/gamegrades.routes.js")(app);
require("./app/routes/ncaateams.routes")(app);
require("./app/routes/ncaaplayer.routes")(app);
require("./app/routes/ncaaplayerleague.routes")(app);

function startServer() {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}

if (require.main === module) {
  // This block will be executed if this file is run directly
  startServer();
} else {
  // This block will be executed if this file is imported as a module (for example, in a test file)
  module.exports = app;
}

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
