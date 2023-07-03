/* eslint-disable strict */
const cors = require("cors");
const controller = require("../controllers/ncaaplayer.controller");

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Queries MongoDB database for players by team
  app.get("/api/ncaa-d1-mens-team/:id", cors(), controller.getNcaaPlayer);
};
