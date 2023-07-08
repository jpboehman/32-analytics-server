/* eslint-disable strict */
const cors = require("cors");
const controller = require("../controllers/ncaaplayerleague.controller");

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/ncaa-d1-mens-league-players",
    cors(),
    controller.getNcaaPlayerLeague
  );

  app.get(
    "/api/ncaa-d1-mens-league-players/:playerId",
    cors(),
    controller.getSingleNcaaPlayerLeague
  );
};
