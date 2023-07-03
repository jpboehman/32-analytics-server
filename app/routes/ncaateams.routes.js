/* eslint-disable strict */
const cors = require("cors");
const controller = require("../controllers/ncaateams.controller");

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/ncaa-d1-mens-teams", cors(), controller.getNcaaTeams);

  // Queries MongoDB database for players by team
  app.get(
    "/api/ncaa-d1-mens-team/:team",
    cors(),
    controller.getNcaaTeamRoster
  );
};
