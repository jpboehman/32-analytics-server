/* eslint-disable strict */
const cors = require("cors");
const controller = require("../controllers/nbagamegrades.controller");

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/nba-game-grades/:playerName/:selectedSeason",
    cors(),
    controller.getGameGrades
  );
};
