/* eslint-disable strict */
const cors = require("cors");
const controller = require("../controllers/nbaplayerleague.controller");

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/nba-league-players",
    cors(),
    controller.getNbaPlayerLeague
  );

  app.get(
    "/api/nba-league-players/:playerId",
    cors(),
    controller.getSingleNbaPlayerLeague
  );
};
